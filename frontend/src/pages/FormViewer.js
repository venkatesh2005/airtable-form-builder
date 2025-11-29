import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formAPI, responseAPI } from '../api';
import { shouldShowQuestion } from '../utils/conditionalLogic';

function FormViewer() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [formId]);

  const fetchForm = async () => {
    try {
      const response = await formAPI.getForm(formId);
      setForm(response.data);
    } catch (error) {
      console.error('Error fetching form:', error);
      alert('Failed to load form');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionKey, value) => {
    setAnswers({ ...answers, [questionKey]: value });
    
    // Clear error for this field
    if (errors[questionKey]) {
      const newErrors = { ...errors };
      delete newErrors[questionKey];
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    form.questions.forEach(question => {
      // Check if question should be shown
      const shouldShow = shouldShowQuestion(question.conditionalRules, answers);
      
      if (!shouldShow) {
        return;
      }

      const answer = answers[question.questionKey];

      // Check required fields
      if (question.required) {
        if (answer === undefined || answer === null || answer === '') {
          newErrors[question.questionKey] = `${question.label} is required`;
          isValid = false;
          return;
        }

        if (Array.isArray(answer) && answer.length === 0) {
          newErrors[question.questionKey] = `${question.label} is required`;
          isValid = false;
          return;
        }
      }

      // Validate field types
      if (answer !== undefined && answer !== null && answer !== '') {
        if (question.type === 'singleSelect' && question.options) {
          if (!question.options.includes(answer)) {
            newErrors[question.questionKey] = `Invalid option for ${question.label}`;
            isValid = false;
          }
        }

        if (question.type === 'multipleSelects') {
          if (!Array.isArray(answer)) {
            newErrors[question.questionKey] = `${question.label} must be an array`;
            isValid = false;
          } else if (question.options) {
            const invalidOptions = answer.filter(opt => !question.options.includes(opt));
            if (invalidOptions.length > 0) {
              newErrors[question.questionKey] = `Invalid options: ${invalidOptions.join(', ')}`;
              isValid = false;
            }
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    setSubmitting(true);

    try {
      await responseAPI.submitResponse({
        formId: formId,
        answers: answers
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form: ' + (error.response?.data?.error || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question) => {
    const shouldShow = shouldShowQuestion(question.conditionalRules, answers);
    
    if (!shouldShow) {
      return null;
    }

    const value = answers[question.questionKey] || '';
    const error = errors[question.questionKey];

    return (
      <div key={question.questionKey} className="form-group">
        <label>
          {question.label}
          {question.required && <span style={{ color: 'red' }}> *</span>}
        </label>

        {question.type === 'singleLineText' && (
          <input
            type="text"
            className="form-control"
            value={value}
            onChange={(e) => handleAnswerChange(question.questionKey, e.target.value)}
            required={question.required}
          />
        )}

        {question.type === 'multilineText' && (
          <textarea
            className="form-control"
            value={value}
            onChange={(e) => handleAnswerChange(question.questionKey, e.target.value)}
            required={question.required}
          />
        )}

        {question.type === 'singleSelect' && (
          <select
            className="form-control"
            value={value}
            onChange={(e) => handleAnswerChange(question.questionKey, e.target.value)}
            required={question.required}
          >
            <option value="">Select an option</option>
            {question.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        )}

        {question.type === 'multipleSelects' && (
          <div>
            {question.options?.map(option => (
              <div key={option} className="checkbox-group">
                <input
                  type="checkbox"
                  id={`${question.questionKey}-${option}`}
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter(v => v !== option);
                    handleAnswerChange(question.questionKey, newValues);
                  }}
                />
                <label htmlFor={`${question.questionKey}-${option}`} style={{ margin: 0 }}>
                  {option}
                </label>
              </div>
            ))}
          </div>
        )}

        {question.type === 'multipleAttachments' && (
          <div>
            <input
              type="file"
              className="form-control"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files);
                handleAnswerChange(question.questionKey, files.map(f => ({
                  filename: f.name,
                  url: URL.createObjectURL(f)
                })));
              }}
            />
            <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Note: File upload is simulated in this demo
            </p>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading form...</div>;
  }

  if (!form) {
    return (
      <div className="container">
        <div className="card">
          <h2>Form not found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h2 style={{ color: '#28a745', marginBottom: '16px' }}>✓ Form Submitted Successfully!</h2>
          <p style={{ marginBottom: '24px' }}>
            Your response has been saved to Airtable and our database.
          </p>
          <button 
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            className="btn btn-primary"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>{form.title}</h1>
        {form.description && (
          <p style={{ color: '#666', marginTop: '8px', marginBottom: '24px' }}>
            {form.description}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          {form.questions.map(question => renderQuestion(question))}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ marginTop: '24px', width: '100%', padding: '12px', fontSize: '16px' }}
          >
            {submitting ? 'Submitting...' : 'Submit Form'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormViewer;
