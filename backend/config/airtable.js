import axios from "axios";
import crypto from 'crypto'

const AIRTABLE_AUTH_URL = "https://airtable.com/oauth2/v1/authorize";
const AIRTABLE_TOKEN_URL = "https://airtable.com/oauth2/v1/token";
const AIRTABLE_API_BASE = "https://api.airtable.com/v0";
const AIRTABLE_META_BASE = "https://api.airtable.com/v0/meta";



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
    airtableClient

};
