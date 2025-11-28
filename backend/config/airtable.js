import axios from "axios";
import crypto from 'crypto'

const AIRTABLE_AUTH_URL = "https://airtable.com/oauth2/v1/authorize";
const AIRTABLE_TOKEN_URL = "https://airtable.com/oauth2/v1/token";
const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const AIRTABLE_META_BASE = "https://api.airtable.com/v0/meta";

function generateRandomString(len = 64) {
    return crypto.randomBytes(len).toString('base64url');
}


function getAuthUrl(res) {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest("base64url");

    const state = generateRandomString(32);
    res.cookie("airtable_code_verifier", codeVerifier, { httpOnly: true });
    res.cookie("airtable_state", state, { httpOnly: true });

    const params = new URLSearchParams({
        client_id: process.env.AIRTABLE_CLIENT_ID,
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
        response_type: "code",
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        state: state
    });

    return `${AIRTABLE_AUTH_URL}?${params.toString()}`;
}
function airtableClient(accessToken) {
    return axios.create({
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}
export {
    AIRTABLE_AUTH_URL,
    AIRTABLE_TOKEN_URL,
    AIRTABLE_API_BASE,
    AIRTABLE_META_BASE,
    getAuthUrl,
    airtableClient

};
