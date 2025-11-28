import axios from "axios";
import { AIRTABLE_TOKEN_URL } from "../config/airtable.js";

export async function exchangeCodeForTokens(code, redirectUri, clientId, clientSecret, codeVerifier) {
  const url = AIRTABLE_TOKEN_URL;


  const credentials = `${clientId}:${clientSecret}`
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: clientId,

    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  });

  const { data } = await axios.post(url, params, {
    headers: {
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
  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret
  });

  const { data } = await axios.post(AIRTABLE_TOKEN_URL, params);

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token || refreshToken
  };
}