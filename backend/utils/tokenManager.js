const axios = require('axios');

async function refreshAccessToken(refreshToken) {
  try {
    const response = await axios.post(
      'https://airtable.com/oauth2/v1/token',
      {
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.AIRTABLE_CLIENT_ID,
        client_secret: process.env.AIRTABLE_CLIENT_SECRET
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Token refresh failed:', error.response?.data || error.message);
    throw new Error('Failed to refresh access token');
  }
}

function isTokenExpired(expiresAt) {
  if (!expiresAt) return true;
  
  const now = new Date();
  const expiration = new Date(expiresAt);
  
  // Consider token expired if less than 5 minutes remaining
  const fiveMinutes = 5 * 60 * 1000;
  return (expiration - now) < fiveMinutes;
}

module.exports = {
  refreshAccessToken,
  isTokenExpired
};
