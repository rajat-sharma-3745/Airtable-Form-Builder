
import User from "../models/User.js";
import { refreshAccessToken } from "../services/oauth.js";


export async function withRefresh(userId, fn, ...args) {
    const user = await User.findById(userId);
    try {
        return await fn(user?.accessToken, ...args)
    } catch (error) {

        if (error.response?.status === 401) {
            console.log("Access token expired → refreshing...");

            const tokens = await refreshAccessToken(
                user.refreshToken,
                process.env.AIRTABLE_CLIENT_ID,
                process.env.AIRTABLE_CLIENT_SECRET
            );
            user.accessToken = tokens.accessToken;
            user.refreshToken = tokens.refreshToken;
            await user.save();

            return await fn(tokens.accessToken, ...args);
        }
        throw error;

    }
}