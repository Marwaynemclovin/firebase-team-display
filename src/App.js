import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import Account from './Pages/Account';
import StaffProfile from './Pages/StaffProfile';
import { AuthProvider, useAuth } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/account" element={<ProtectedAccountRoute />} />
=          <Route path="/staff/:staffName" element={<StaffProfile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Custom Protected Route Component for the Account Page
const ProtectedAccountRoute = () => {
  const auth = useAuth(); // Get the auth object from the AuthContext

  if (!auth.user) {
    // If user is not authenticated, navigate to the SignIn page
    return <Navigate to="/signin" />;
  }

  // If user is authenticated, render the Account component
  return <Account />;
};

export default App;
