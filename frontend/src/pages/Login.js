import React from 'react';
import { authAPI } from '../api';

function Login() {
  const handleLogin = () => {
    authAPI.loginWithAirtable();
  };

  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <h1 style={{ marginBottom: '16px' }}>Airtable Form Builder</h1>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            Create dynamic forms connected to your Airtable bases
          </p>
          
          {error && (
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f8d7da', 
              color: '#721c24', 
              borderRadius: '4px',
              marginBottom: '16px'
            }}>
              {error === 'missing_params' && 'Missing OAuth parameters'}
              {error === 'invalid_state' && 'Invalid state token'}
              {error === 'auth_failed' && 'Authentication failed. Please try again.'}
            </div>
          )}
          
          <button 
            onClick={handleLogin}
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '16px' }}
          >
            Login with Airtable
          </button>
          
          <p style={{ marginTop: '24px', fontSize: '14px', color: '#999' }}>
            You'll be redirected to Airtable to authorize this application
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
