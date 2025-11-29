const express = require('express');
const router = express.Router();
const axios = require('axios');
const User = require('../models/User');
const crypto = require('crypto');

const stateTokens = new Map();
const codeVerifiers = new Map();

function generatePKCE() {
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64url');
  
  return { codeVerifier, codeChallenge };
}

router.get('/airtable', (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  const { codeVerifier, codeChallenge } = generatePKCE();
  
  stateTokens.set(state, Date.now());
  codeVerifiers.set(state, codeVerifier);
  
  const authUrl = `https://airtable.com/oauth2/v1/authorize?` +
    `client_id=${process.env.AIRTABLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(process.env.AIRTABLE_REDIRECT_URI)}&` +
    `response_type=code&` +
    `state=${state}&` +
    `code_challenge=${codeChallenge}&` +
    `code_challenge_method=S256&` +
    `scope=data.records:read data.records:write schema.bases:read webhook:manage`;
  
  res.redirect(authUrl);
});

router.get('/airtable/callback', async (req, res) => {
  const { code, state } = req.query;
  
  if (!code || !state) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=missing_params`);
  }
  
  if (!stateTokens.has(state)) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_state`);
  }
  
  const codeVerifier = codeVerifiers.get(state);
  if (!codeVerifier) {
    return res.redirect(`${process.env.FRONTEND_URL}/login?error=invalid_state`);
  }
  
  stateTokens.delete(state);
  codeVerifiers.delete(state);
  
  try {
    const credentials = Buffer.from(
      `${process.env.AIRTABLE_CLIENT_ID}:${process.env.AIRTABLE_CLIENT_SECRET}`
    ).toString('base64');
    
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: process.env.AIRTABLE_REDIRECT_URI,
      code_verifier: codeVerifier
    });
    
    const tokenResponse = await axios.post(
      'https://airtable.com/oauth2/v1/token',
      tokenParams.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${credentials}`
        }
      }
    );
    
    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    
    if (!access_token) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_token`);
    }
    
    const userResponse = await axios.get('https://api.airtable.com/v0/meta/whoami', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    });
    
    const airtableUser = userResponse.data;
    let user = await User.findOne({ airtableUserId: airtableUser.id });
    
    if (user) {
      user.accessToken = access_token;
      user.refreshToken = refresh_token;
      user.tokenExpiresAt = new Date(Date.now() + expires_in * 1000);
      user.lastLogin = new Date();
      user.email = airtableUser.email || user.email;
    } else {
      user = new User({
        airtableUserId: airtableUser.id,
        email: airtableUser.email,
        name: airtableUser.name || airtableUser.email,
        accessToken: access_token,
        refreshToken: refresh_token,
        tokenExpiresAt: new Date(Date.now() + expires_in * 1000)
      });
    }
    
    await user.save();
    
    req.session.userId = user._id;
    req.session.airtableUserId = user.airtableUserId;
    
    res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
});

router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const user = await User.findById(req.session.userId).select('-accessToken -refreshToken');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
