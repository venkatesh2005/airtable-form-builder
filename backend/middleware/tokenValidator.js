const User = require('../models/User');
const { refreshAccessToken, isTokenExpired } = require('../utils/tokenManager');

/**
 * Middleware to ensure user has valid Airtable access token
 * Automatically refreshes if expired
 */
const ensureValidToken = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  
  try {
    const user = await User.findById(req.session.userId);
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    // Check if token needs refresh
    if (isTokenExpired(user.tokenExpiresAt)) {
      console.log('Token expired, refreshing...');
      
      const tokenData = await refreshAccessToken(user.refreshToken);
      
      user.accessToken = tokenData.access_token;
      if (tokenData.refresh_token) {
        user.refreshToken = tokenData.refresh_token;
      }
      user.tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
      
      await user.save();
      console.log('Token refreshed');
    }
    
    // Attach user to request for use in routes
    req.user = user;
    next();
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ error: 'Token validation failed', message: error.message });
  }
};

module.exports = { ensureValidToken };
