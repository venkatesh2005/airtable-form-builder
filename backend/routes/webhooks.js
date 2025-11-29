const express = require('express');
const router = express.Router();
const Response = require('../models/Response');
const crypto = require('crypto');

// Airtable webhook endpoint
router.post('/airtable', async (req, res) => {
  try {
    // Verify webhook signature if secret is configured
    if (process.env.AIRTABLE_WEBHOOK_SECRET) {
      const signature = req.headers['x-airtable-content-mac'];
      const timestamp = req.headers['x-airtable-content-timestamp'];
      
      if (!signature || !timestamp) {
        return res.status(401).json({ error: 'Missing webhook signature' });
      }
      
      // Verify timestamp is recent (within 5 minutes)
      const currentTime = Math.floor(Date.now() / 1000);
      if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
        return res.status(401).json({ error: 'Webhook timestamp too old' });
      }
      
      // Verify signature
      const payload = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', process.env.AIRTABLE_WEBHOOK_SECRET)
        .update(`${timestamp}.${payload}`)
        .digest('base64');
      
      if (signature !== expectedSignature) {
        return res.status(401).json({ error: 'Invalid webhook signature' });
      }
    }
    
    const webhookData = req.body;
    
    // Handle different webhook events
    if (webhookData.base && webhookData.webhook) {
      const { changedTablesById } = webhookData;
      
      if (changedTablesById) {
        // Process changed records
        for (const tableId in changedTablesById) {
          const tableChanges = changedTablesById[tableId];
          
          // Handle created records
          if (tableChanges.createdRecordsById) {
            console.log('New records created:', Object.keys(tableChanges.createdRecordsById));
          }
          
          // Handle changed records
          if (tableChanges.changedRecordsById) {
            for (const recordId in tableChanges.changedRecordsById) {
              await handleRecordUpdate(recordId, tableChanges.changedRecordsById[recordId]);
            }
          }
          
          // Handle destroyed records
          if (tableChanges.destroyedRecordIds) {
            for (const recordId of tableChanges.destroyedRecordIds) {
              await handleRecordDelete(recordId);
            }
          }
        }
      }
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

// Handle record update
async function handleRecordUpdate(airtableRecordId, changes) {
  try {
    const response = await Response.findOne({ airtableRecordId });
    
    if (response) {
      // Update the answers with changed fields
      const changedFields = changes.current?.cellValuesByFieldId || {};
      
      // Merge changes into existing answers
      for (const fieldId in changedFields) {
        // Find the corresponding questionKey
        // This would require looking up the form and mapping fieldId to questionKey
        // For simplicity, we'll store the raw change
        response.answers[fieldId] = changedFields[fieldId];
      }
      
      response.updatedAt = new Date();
      await response.save();
      
      console.log(`Updated response ${response._id} for Airtable record ${airtableRecordId}`);
    }
  } catch (error) {
    console.error(`Error updating record ${airtableRecordId}:`, error);
  }
}

// Handle record deletion
async function handleRecordDelete(airtableRecordId) {
  try {
    const response = await Response.findOne({ airtableRecordId });
    
    if (response) {
      // Mark as deleted instead of hard delete
      response.deletedInAirtable = true;
      response.updatedAt = new Date();
      await response.save();
      
      console.log(`Marked response ${response._id} as deleted in Airtable`);
    }
  } catch (error) {
    console.error(`Error marking record ${airtableRecordId} as deleted:`, error);
  }
}

module.exports = router;
