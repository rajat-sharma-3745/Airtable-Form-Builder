import { AIRTABLE_AUTH_URL } from "../config/airtable.js";
import User from "../models/User.js";
import { exchangeCodeForTokens } from "../services/oauth.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendToken } from "../utils/feature.js";
import crypto from 'crypto';
import axios from 'axios';

function generateRandomString(len = 64) {
    return crypto.randomBytes(len).toString('base64url');
}
export const loginController = asyncHandler(async (req, res) => {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64url");

    const state = generateRandomString(32);
    res.cookie("airtable_code_verifier", codeVerifier, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });
    res.cookie("airtable_state", state, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });

    const params = new URLSearchParams({
        client_id: process.env.AIRTABLE_CLIENT_ID,
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
        response_type: "code",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state: state,
        scope: "schema.bases:read schema.bases:write data.records:read data.records:write user.email:read webhook:manage",
    });

    const url = `${AIRTABLE_AUTH_URL}?${params.toString()}`;

    res.json(url);
})

export const callbackController = asyncHandler(async (req, res, next) => {
    const { code } = req.query;
    const returnedState = req.query.state;

    console.log(code)

    if (!code) return next(new ApiError('Missing Code', 400));
    console.log(req.cookies.airtable_state)

    const codeVerifier = req.cookies.airtable_code_verifier;
    const savedState = req.cookies.airtable_state;

    if (returnedState !== savedState) {
        return res.status(400).json({ message: "Invalid state" });
    }
    const { accessToken, refreshToken } = await exchangeCodeForTokens(
        code,
        process.env.AIRTABLE_REDIRECT_URI,
        process.env.AIRTABLE_CLIENT_ID,
        process.env.AIRTABLE_CLIENT_SECRET,
        codeVerifier
    );

    const profileRes = await axios.get("https://api.airtable.com/v0/meta/whoami", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    const profile = profileRes.data;

    let user = await User.findOne({ airtableUserId: profile.id });

    if (!user) {
        user = await User.create({
            airtableUserId: profile.id,
            name: profile?.name || profile.email?.split('@')[0] ,
            email: profile.email,
            accessToken,
            refreshToken
        });
    } else {
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        await user.save();
    }
    res.clearCookie("airtable_code_verifier");
    res.clearCookie("airtable_state");
    sendToken(res, user, 200, "Logged in successfully", '/dashboard');

})