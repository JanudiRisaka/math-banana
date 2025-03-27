// server/config/oauth.config.js
export const googleAuth = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.BASE_URL + '/auth/google/callback',
  refreshToken: process.env.GOOGLE_REFRESH_TOKEN
};