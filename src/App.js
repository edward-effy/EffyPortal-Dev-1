import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MsalProvider, useIsAuthenticated } from '@azure/msal-react';
import Home from './Pages/PageLayout';
import NCL from './Pages/NCL';
import Carnival from './Pages/Carnival';
import './App.css';

function App({ msalInstance }) {
  return (
    <MsalProvider instance={msalInstance}>
      <Pages />
    </MsalProvider>
  );
}

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const Pages = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Carnival" element={<ProtectedRoute><Carnival /></ProtectedRoute>} />
      <Route path="/NCL" element={<ProtectedRoute><NCL /></ProtectedRoute>} />
      {/* Future Pages */}
    </Routes>
  );
};

export default App;
