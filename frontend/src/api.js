import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  getCurrentUser: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  loginWithAirtable: () => {
    window.location.href = `${API_URL}/auth/airtable`;
  },
};

export const airtableAPI = {
  getBases: () => api.get('/airtable/bases'),
  getTables: (baseId) => api.get(`/airtable/bases/${baseId}/tables`),
  getFields: (baseId, tableId) => api.get(`/airtable/bases/${baseId}/tables/${tableId}/fields`),
};

export const formAPI = {
  getAllForms: () => api.get('/forms'),
  getForm: (formId) => api.get(`/forms/${formId}`),
  createForm: (formData) => api.post('/forms', formData),
  updateForm: (formId, formData) => api.put(`/forms/${formId}`, formData),
  deleteForm: (formId) => api.delete(`/forms/${formId}`),
};

export const responseAPI = {
  submitResponse: (responseData) => api.post('/responses', responseData),
  getFormResponses: (formId) => api.get(`/responses/form/${formId}`),
  getResponse: (responseId) => api.get(`/responses/${responseId}`),
};

export default api;
