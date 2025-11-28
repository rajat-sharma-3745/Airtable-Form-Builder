import { getAuthUrl } from "../config/airtable.js";
import User from "../models/User.js";
import { exchangeCodeForTokens } from "../services/oauth.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendToken } from "../utils/feature.js";

export const airtableLogin = asyncHandler(async (req, res) => {
    const url = getAuthUrl();
    res.json(url);
})

export const airtableCallback = asyncHandler(async (req, res, next) => {
    const { code } = req.query;

    if (!code) return next(new ApiError('Missing Code', 400));
    const { accessToken, refreshToken } = await exchangeCodeForTokens(
        code,
        process.env.AIRTABLE_REDIRECT_URI,
        process.env.AIRTABLE_CLIENT_ID,
        process.env.AIRTABLE_CLIENT_SECRET
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
    sendToken(res, user, 200, "Logged in successfully",'/dashboard');

})