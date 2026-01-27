/**
 * Google OAuth provider service
 * @module services/oauth/google
 */

const axios = require("axios");
const crypto = require("crypto");
const { google } = require("../../config/oauth.config");

const generateState = () => crypto.randomBytes(20).toString("hex");

const getGoogleAuthUrl = (state) => {
  const params = new URLSearchParams({
    client_id: google.clientId,
    redirect_uri: google.callbackUrl,
    response_type: "code",
    scope: ["openid", "email", "profile"].join(" "),
    access_type: "offline",
    prompt: "consent",
    state,
  });

  return `${google.authUrl}?${params.toString()}`;
};

const getGoogleUser = async (code) => {
  const tokenRes = await axios.post(
    google.tokenUrl,
    new URLSearchParams({
      code,
      client_id: google.clientId,
      client_secret: google.clientSecret,
      redirect_uri: google.callbackUrl,
      grant_type: "authorization_code",
    }).toString(),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const { access_token } = tokenRes.data;

  const userRes = await axios.get(google.userInfoUrl, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return {
    provider: "google",
    providerId: userRes.data.id,
    email: userRes.data.email,
    name: userRes.data.name,
    avatar: userRes.data.picture,
  };
};

module.exports = {
  generateState,
  getGoogleAuthUrl,
  getGoogleUser,
};
