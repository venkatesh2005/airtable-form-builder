const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAuthenticated } = require('../middleware/auth');
const { ensureValidToken } = require('../middleware/tokenValidator');
const User = require('../models/User');

router.get('/bases', isAuthenticated, ensureValidToken, async (req, res) => {
  try {
    const user = req.user;
    
    const response = await axios.get('https://api.airtable.com/v0/meta/bases', {
      headers: {
        'Authorization': `Bearer ${user.accessToken}`
      }
    });
    
    res.json(response.data.bases);
  } catch (error) {
    console.error('Error fetching bases:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Airtable bases' });
  }
});

router.get('/bases/:baseId/tables', isAuthenticated, ensureValidToken, async (req, res) => {
  try {
    const user = req.user;
    const { baseId } = req.params;
    
    const response = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        'Authorization': `Bearer ${user.accessToken}`
      }
    });
    
    res.json(response.data.tables);
  } catch (error) {
    console.error('Error fetching tables:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Airtable tables' });
  }
});

router.get('/bases/:baseId/tables/:tableId/fields', isAuthenticated, ensureValidToken, async (req, res) => {
  try {
    const user = req.user;
    const { baseId, tableId } = req.params;
    
    const response = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        'Authorization': `Bearer ${user.accessToken}`
      }
    });
    
    const table = response.data.tables.find(t => t.id === tableId);
    
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    const supportedTypes = ['singleLineText', 'multilineText', 'singleSelect', 'multipleSelects', 'multipleAttachments'];
    const fields = table.fields.filter(field => supportedTypes.includes(field.type));
    
    res.json(fields);
  } catch (error) {
    console.error('Error fetching fields:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Airtable fields' });
  }
});

router.post('/bases/:baseId/tables/:tableIdOrName/records', isAuthenticated, ensureValidToken, async (req, res) => {
  try {
    const user = req.user;
    const { baseId, tableIdOrName } = req.params;
    const { fields } = req.body;
    
    const response = await axios.post(
      `https://api.airtable.com/v0/${baseId}/${tableIdOrName}`,
      { fields },
      {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error creating record:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to create Airtable record' });
  }
});

module.exports = router;
