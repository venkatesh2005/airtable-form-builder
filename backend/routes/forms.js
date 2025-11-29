const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const Form = require('../models/Form');

// Get all forms for authenticated user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const forms = await Form.find({ owner: req.session.userId })
      .sort({ createdAt: -1 })
      .select('-questions.conditionalRules');
    
    res.json(forms);
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({ error: 'Failed to fetch forms' });
  }
});

// Get a specific form by ID
router.get('/:formId', async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    res.json(form);
  } catch (error) {
    console.error('Error fetching form:', error);
    res.status(500).json({ error: 'Failed to fetch form' });
  }
});

// Create a new form
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { title, description, airtableBaseId, airtableTableId, airtableTableName, questions } = req.body;
    
    // Validate required fields
    if (!title || !airtableBaseId || !airtableTableId || !questions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Validate question types
    const supportedTypes = ['singleLineText', 'multilineText', 'singleSelect', 'multipleSelects', 'multipleAttachments'];
    const invalidQuestions = questions.filter(q => !supportedTypes.includes(q.type));
    
    if (invalidQuestions.length > 0) {
      return res.status(400).json({ 
        error: 'Unsupported question types found',
        invalidTypes: invalidQuestions.map(q => q.type)
      });
    }
    
    const form = new Form({
      owner: req.session.userId,
      title,
      description,
      airtableBaseId,
      airtableTableId,
      airtableTableName,
      questions
    });
    
    await form.save();
    
    res.status(201).json(form);
  } catch (error) {
    console.error('Error creating form:', error);
    res.status(500).json({ error: 'Failed to create form' });
  }
});

// Update a form
router.put('/:formId', isAuthenticated, async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    // Check ownership
    if (form.owner.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    const { title, description, questions } = req.body;
    
    if (title) form.title = title;
    if (description !== undefined) form.description = description;
    if (questions) {
      // Validate question types
      const supportedTypes = ['singleLineText', 'multilineText', 'singleSelect', 'multipleSelects', 'multipleAttachments'];
      const invalidQuestions = questions.filter(q => !supportedTypes.includes(q.type));
      
      if (invalidQuestions.length > 0) {
        return res.status(400).json({ 
          error: 'Unsupported question types found',
          invalidTypes: invalidQuestions.map(q => q.type)
        });
      }
      
      form.questions = questions;
    }
    
    await form.save();
    
    res.json(form);
  } catch (error) {
    console.error('Error updating form:', error);
    res.status(500).json({ error: 'Failed to update form' });
  }
});

// Delete a form
router.delete('/:formId', isAuthenticated, async (req, res) => {
  try {
    const form = await Form.findById(req.params.formId);
    
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    
    // Check ownership
    if (form.owner.toString() !== req.session.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    await Form.findByIdAndDelete(req.params.formId);
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    console.error('Error deleting form:', error);
    res.status(500).json({ error: 'Failed to delete form' });
  }
});

module.exports = router;
