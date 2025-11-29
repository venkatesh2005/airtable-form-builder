import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { responseAPI, formAPI } from '../api';

function ResponseList() {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [formId]);

  const fetchData = async () => {
    try {
      const [formResponse, responsesResponse] = await Promise.all([
        formAPI.getForm(formId),
        responseAPI.getFormResponses(formId)
      ]);
      
      setForm(formResponse.data);
      setResponses(responsesResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load responses');
    } finally {
      setLoading(false);
    }
  };

  const getAnswersPreview = (answers) => {
    const entries = Object.entries(answers).slice(0, 3);
    return entries.map(([key, value]) => {
      let displayValue = value;
      if (Array.isArray(value)) {
        displayValue = value.join(', ');
      } else if (typeof value === 'object') {
        displayValue = JSON.stringify(value);
      }
      return `${key}: ${displayValue}`;
    }).join(' | ');
  };

  if (loading) {
    return <div className="loading">Loading responses...</div>;
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Form Responses: {form?.title}</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => navigate(`/form/${formId}`)}
              className="btn btn-primary"
            >
              View Form
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <div style={{ marginBottom: '24px' }}>
            <h2>All Responses ({responses.length})</h2>
            <p style={{ color: '#666' }}>
              Responses are stored in MongoDB and synced with Airtable
            </p>
          </div>

          {responses.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No responses yet. Be the first to fill out this form!</p>
              <button 
                onClick={() => navigate(`/form/${formId}`)}
                className="btn btn-primary"
                style={{ marginTop: '16px' }}
              >
                Fill Out Form
              </button>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Airtable Record ID</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Answers Preview</th>
                </tr>
              </thead>
              <tbody>
                {responses.map(response => (
                  <tr key={response._id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                      {response._id.substring(0, 8)}...
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                      {response.airtableRecordId}
                    </td>
                    <td>
                      {new Date(response.createdAt).toLocaleString()}
                    </td>
                    <td>
                      {response.deletedInAirtable ? (
                        <span className="badge badge-danger">Deleted in Airtable</span>
                      ) : (
                        <span className="badge badge-success">Active</span>
                      )}
                    </td>
                    <td style={{ fontSize: '12px', maxWidth: '400px' }}>
                      {getAnswersPreview(response.answers)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {responses.length > 0 && (
          <div className="card">
            <h3>Export Options</h3>
            <p style={{ color: '#666', marginBottom: '16px' }}>
              Export all responses for analysis
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  const dataStr = JSON.stringify(responses, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `responses-${formId}-${Date.now()}.json`;
                  link.click();
                }}
              >
                Export as JSON
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  // Simple CSV export
                  const headers = ['ID', 'Airtable Record ID', 'Created At', 'Deleted', 'Answers'];
                  const rows = responses.map(r => [
                    r._id,
                    r.airtableRecordId,
                    new Date(r.createdAt).toISOString(),
                    r.deletedInAirtable,
                    JSON.stringify(r.answers)
                  ]);
                  
                  const csv = [
                    headers.join(','),
                    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
                  ].join('\n');
                  
                  const dataBlob = new Blob([csv], { type: 'text/csv' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `responses-${formId}-${Date.now()}.csv`;
                  link.click();
                }}
              >
                Export as CSV
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResponseList;
