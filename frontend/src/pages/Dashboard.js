import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, formAPI } from '../api';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserAndForms();
  }, []);

  const fetchUserAndForms = async () => {
    try {
      const [userResponse, formsResponse] = await Promise.all([
        authAPI.getCurrentUser(),
        formAPI.getAllForms()
      ]);
      
      setUser(userResponse.data);
      setForms(formsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteForm = async (formId) => {
    if (!window.confirm('Are you sure you want to delete this form?')) {
      return;
    }

    try {
      await formAPI.deleteForm(formId);
      setForms(forms.filter(f => f._id !== formId));
    } catch (error) {
      console.error('Error deleting form:', error);
      alert('Failed to delete form');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-content">
          <h1>Airtable Form Builder</h1>
          <div className="navbar-links">
            <span>Welcome, {user?.name || user?.email}</span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px' }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>My Forms</h2>
            <button 
              onClick={() => navigate('/forms/new')}
              className="btn btn-primary"
            >
              Create New Form
            </button>
          </div>

          {forms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <p>No forms yet. Create your first form to get started!</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Form Title</th>
                  <th>Airtable Table</th>
                  <th>Questions</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {forms.map(form => (
                  <tr key={form._id}>
                    <td>{form.title}</td>
                    <td>{form.airtableTableName || form.airtableTableId}</td>
                    <td>{form.questions?.length || 0}</td>
                    <td>{new Date(form.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => navigate(`/form/${form._id}`)}
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          View
                        </button>
                        <button 
                          onClick={() => navigate(`/forms/${form._id}/responses`)}
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Responses
                        </button>
                        <button 
                          onClick={() => handleDeleteForm(form._id)}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
