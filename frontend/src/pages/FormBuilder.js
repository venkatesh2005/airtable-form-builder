import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { airtableAPI, formAPI } from '../api';

function FormBuilder() {
  const navigate = useNavigate();
  const [bases, setBases] = useState([]);
  const [tables, setTables] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    airtableBaseId: '',
    airtableTableId: '',
    airtableTableName: '',
    questions: []
  });

  const [selectedFields, setSelectedFields] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);

  useEffect(() => {
    fetchBases();
  }, []);

  const fetchBases = async () => {
    try {
      setLoading(true);
      const response = await airtableAPI.getBases();
      setBases(response.data || []);
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBaseChange = async (baseId) => {
    setFormData({ ...formData, airtableBaseId: baseId, airtableTableId: '', airtableTableName: '' });
    setTables([]);
    setFields([]);
    setSelectedFields([]);
    
    if (baseId) {
      try {
        const response = await airtableAPI.getTables(baseId);
        setTables(response.data);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    }
  };

  const handleTableChange = async (tableId) => {
    const table = tables.find(t => t.id === tableId);
    setFormData({ 
      ...formData, 
      airtableTableId: tableId,
      airtableTableName: table?.name || ''
    });
    setFields([]);
    setSelectedFields([]);
    
    if (tableId && formData.airtableBaseId) {
      try {
        const response = await airtableAPI.getFields(formData.airtableBaseId, tableId);
        setFields(response.data);
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    }
  };

  const handleFieldToggle = (field) => {
    const exists = selectedFields.find(f => f.id === field.id);
    
    if (exists) {
      setSelectedFields(selectedFields.filter(f => f.id !== field.id));
      setFormData({
        ...formData,
        questions: formData.questions.filter(q => q.airtableFieldId !== field.id)
      });
    } else {
      const newField = {
        id: field.id,
        name: field.name,
        type: field.type
      };
      setSelectedFields([...selectedFields, newField]);
      
      const newQuestion = {
        questionKey: field.name.toLowerCase().replace(/\s+/g, '_'),
        airtableFieldId: field.id,
        label: field.name,
        type: field.type,
        required: false,
        options: field.options?.choices?.map(c => c.name) || [],
        conditionalRules: null
      };
      
      setFormData({
        ...formData,
        questions: [...formData.questions, newQuestion]
      });
    }
  };

  const updateQuestion = (index, updates) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updates };
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addCondition = (questionIndex) => {
    const question = formData.questions[questionIndex];
    const newRules = question.conditionalRules || { logic: 'AND', conditions: [] };
    
    newRules.conditions.push({
      questionKey: '',
      operator: 'equals',
      value: ''
    });
    
    updateQuestion(questionIndex, { conditionalRules: newRules });
  };

  const updateCondition = (questionIndex, conditionIndex, updates) => {
    const question = formData.questions[questionIndex];
    const updatedConditions = [...question.conditionalRules.conditions];
    updatedConditions[conditionIndex] = { ...updatedConditions[conditionIndex], ...updates };
    
    updateQuestion(questionIndex, {
      conditionalRules: {
        ...question.conditionalRules,
        conditions: updatedConditions
      }
    });
  };

  const removeCondition = (questionIndex, conditionIndex) => {
    const question = formData.questions[questionIndex];
    const updatedConditions = question.conditionalRules.conditions.filter((_, i) => i !== conditionIndex);
    
    if (updatedConditions.length === 0) {
      updateQuestion(questionIndex, { conditionalRules: null });
    } else {
      updateQuestion(questionIndex, {
        conditionalRules: {
          ...question.conditionalRules,
          conditions: updatedConditions
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.airtableBaseId || !formData.airtableTableId || formData.questions.length === 0) {
      alert('Please fill in all required fields and select at least one question');
      return;
    }
    
    try {
      setLoading(true);
      await formAPI.createForm(formData);
      alert('Form created successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating form:', error);
      alert('Failed to create form: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Create New Form</h1>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="card">
            <h2>Form Details</h2>
            
            <div className="form-group">
              <label>Form Title *</label>
              <input
                type="text"
                className="form-control"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter form title"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter form description (optional)"
              />
            </div>
          </div>

          <div className="card">
            <h2>Select Airtable Source</h2>
            
            <div className="form-group">
              <label>Airtable Base *</label>
              <select
                className="form-control"
                value={formData.airtableBaseId}
                onChange={(e) => handleBaseChange(e.target.value)}
                required
              >
                <option value="">Select a base</option>
                {bases.map(base => (
                  <option key={base.id} value={base.id}>{base.name}</option>
                ))}
              </select>
            </div>

            {tables.length > 0 && (
              <div className="form-group">
                <label>Airtable Table *</label>
                <select
                  className="form-control"
                  value={formData.airtableTableId}
                  onChange={(e) => handleTableChange(e.target.value)}
                  required
                >
                  <option value="">Select a table</option>
                  {tables.map(table => (
                    <option key={table.id} value={table.id}>{table.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {fields.length > 0 && (
            <div className="card">
              <h2>Select Fields</h2>
              <p style={{ color: '#666', marginBottom: '16px' }}>
                Choose which fields from your Airtable table to include in the form
              </p>
              
              {fields.map(field => (
                <div key={field.id} className="checkbox-group">
                  <input
                    type="checkbox"
                    id={field.id}
                    checked={selectedFields.some(f => f.id === field.id)}
                    onChange={() => handleFieldToggle(field)}
                  />
                  <label htmlFor={field.id} style={{ margin: 0, cursor: 'pointer' }}>
                    {field.name} <span className="badge badge-info">{field.type}</span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {formData.questions.length > 0 && (
            <div className="card">
              <h2>Configure Questions</h2>
              
              {formData.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-item">
                  <h3 style={{ marginBottom: '16px' }}>{question.label}</h3>
                  
                  <div className="form-group">
                    <label>Custom Label</label>
                    <input
                      type="text"
                      className="form-control"
                      value={question.label}
                      onChange={(e) => updateQuestion(qIndex, { label: e.target.value })}
                    />
                  </div>

                  <div className="checkbox-group">
                    <input
                      type="checkbox"
                      id={`required-${qIndex}`}
                      checked={question.required}
                      onChange={(e) => updateQuestion(qIndex, { required: e.target.checked })}
                    />
                    <label htmlFor={`required-${qIndex}`} style={{ margin: 0 }}>
                      Required field
                    </label>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <h4>Conditional Logic</h4>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => addCondition(qIndex)}
                      style={{ marginTop: '8px', padding: '6px 12px', fontSize: '12px' }}
                    >
                      Add Condition
                    </button>

                    {question.conditionalRules && question.conditionalRules.conditions.length > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        <div className="form-group">
                          <label>Logic</label>
                          <select
                            className="form-control"
                            value={question.conditionalRules.logic}
                            onChange={(e) => updateQuestion(qIndex, {
                              conditionalRules: {
                                ...question.conditionalRules,
                                logic: e.target.value
                              }
                            })}
                          >
                            <option value="AND">AND (all conditions must be true)</option>
                            <option value="OR">OR (any condition can be true)</option>
                          </select>
                        </div>

                        {question.conditionalRules.conditions.map((condition, cIndex) => (
                          <div key={cIndex} style={{ 
                            border: '1px solid #ddd', 
                            padding: '12px', 
                            borderRadius: '4px',
                            marginBottom: '8px',
                            backgroundColor: 'white'
                          }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px' }}>
                              <select
                                className="form-control"
                                value={condition.questionKey}
                                onChange={(e) => updateCondition(qIndex, cIndex, { questionKey: e.target.value })}
                              >
                                <option value="">Select question</option>
                                {formData.questions
                                  .filter((_, idx) => idx !== qIndex)
                                  .map(q => (
                                    <option key={q.questionKey} value={q.questionKey}>
                                      {q.label}
                                    </option>
                                  ))
                                }
                              </select>

                              <select
                                className="form-control"
                                value={condition.operator}
                                onChange={(e) => updateCondition(qIndex, cIndex, { operator: e.target.value })}
                              >
                                <option value="equals">equals</option>
                                <option value="notEquals">not equals</option>
                                <option value="contains">contains</option>
                              </select>

                              <input
                                type="text"
                                className="form-control"
                                placeholder="Value"
                                value={condition.value}
                                onChange={(e) => updateCondition(qIndex, cIndex, { value: e.target.value })}
                              />

                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => removeCondition(qIndex, cIndex)}
                                style={{ padding: '8px 12px' }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {formData.questions.length > 0 && (
            <div className="card">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ width: '100%', padding: '12px', fontSize: '16px' }}
              >
                {loading ? 'Creating Form...' : 'Create Form'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default FormBuilder;
