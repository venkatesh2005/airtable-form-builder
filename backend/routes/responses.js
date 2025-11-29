const express = require('express');
const router = express.Router();
const axios = require('axios');
const Response = require('../models/Response');
const Form = require('../models/Form');
const User = require('../models/User');
const { validateFormSubmission } = require('../utils/conditionalLogic');

// Submit a form response
router.post('/', async (req, res) => {
  try {
    const { formId, answers } = req.body;
    
    if (!formId || !answers) {
      return res.status(400).json({ error: 'Missing formId or answers' });
    }
    
    // Get form definition
    const form = await Form.findById(formId).populate('owner');
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    // Validate form submission
    const validation = validateFormSubmission(form, answers);
    
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed',
        errors: validation.errors
      });
    }
    
    // Prepare data for Airtable
    const airtableFields = {};
    form.questions.forEach(question => {
      const answer = answers[question.questionKey];
      if (answer !== undefined && answer !== null && answer !== '') {
        airtableFields[question.airtableFieldId] = answer;
      }
    });
    
    // Save to Airtable
    const user = form.owner;
    let airtableRecord;
    
    try {
      const airtableResponse = await axios.post(
        `https://api.airtable.com/v0/${form.airtableBaseId}/${form.airtableTableId}`,
        { fields: airtableFields },
        {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      airtableRecord = airtableResponse.data;
    } catch (error) {
      console.error('Error saving to Airtable:', error.response?.data || error.message);
      return res.status(500).json({ 
        error: 'Failed to save response to Airtable',
        details: error.response?.data?.error
      });
    }
    
    // Save to MongoDB
    const response = new Response({
      formId: formId,
      airtableRecordId: airtableRecord.id,
      answers: answers
    });
    
    await response.save();
    
    res.status(201).json({
      message: 'Response submitted successfully',
      responseId: response._id,
      airtableRecordId: airtableRecord.id
    });
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

// Get all responses for a form
router.get('/form/:formId', async (req, res) => {
  try {
    const { formId } = req.params;
    
    const responses = await Response.find({ formId })
      .sort({ createdAt: -1 });
    
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// Get a specific response
router.get('/:responseId', async (req, res) => {
  try {
    const response = await Response.findById(req.params.responseId);
    
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({ error: 'Failed to fetch response' });
  }
});

module.exports = router;
