import axios from "axios";
import { AIRTABLE_TOKEN_URL } from "../config/airtable.js";

export async function exchangeCodeForTokens(code, redirectUri, clientId, clientSecret, codeVerifier) {
  const url = AIRTABLE_TOKEN_URL;


  const credentials = Buffer
    .from(`${clientId}:${clientSecret}`)
    .toString("base64");
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: clientId,

    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const { data } = await axios.post(url, params, {
    headers: {
      "Content-Type": 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`
    }
  });

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in
  };
}

export async function refreshAccessToken(refreshToken, clientId, clientSecret) {

  const credentials = Buffer
    .from(`${clientId}:${clientSecret}`)
    .toString("base64");
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId
  });

  const { data } = await axios.post(AIRTABLE_TOKEN_URL, params, {
    headers: {
      "Content-Type": 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`
    }
  });

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken
  };
}