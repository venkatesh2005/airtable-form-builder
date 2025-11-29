import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FormBuilder from './pages/FormBuilder';
import FormViewer from './pages/FormViewer';
import ResponseList from './pages/ResponseList';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forms/new" element={<FormBuilder />} />
        <Route path="/forms/:formId/edit" element={<FormBuilder />} />
        <Route path="/form/:formId" element={<FormViewer />} />
        <Route path="/forms/:formId/responses" element={<ResponseList />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
