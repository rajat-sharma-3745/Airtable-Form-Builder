import { getAuthUrl } from "../config/airtable.js";
import User from "../models/User.js";
import { exchangeCodeForTokens } from "../services/oauth.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendToken } from "../utils/feature.js";

export const airtableLogin = asyncHandler(async (req, res) => {
    const url = getAuthUrl(res);
    res.json(url);
})

export const airtableCallback = asyncHandler(async (req, res, next) => {
    const { code } = req.query;
    const returnedState = req.query.state;

    console.log(code)

    if (!code) return next(new ApiError('Missing Code', 400));
    console.log(req.cookies)

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
            name: profile.email,
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