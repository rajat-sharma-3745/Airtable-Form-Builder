import axios from "axios";
import crypto from 'crypto'

const AIRTABLE_AUTH_URL = "https://airtable.com/oauth2/v1/authorize";
const AIRTABLE_TOKEN_URL = "https://airtable.com/oauth2/v1/token";
const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const AIRTABLE_META_BASE = "https://api.airtable.com/v0/meta";

function getAuthUrl() {
     const state = crypto.randomBytes(32).toString("base64url");
    const params = new URLSearchParams({
        client_id: process.env.AIRTABLE_CLIENT_ID,
        redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
        response_type: "code",
        state:state
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
