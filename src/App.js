import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './ThemeContext/ThemeContext';
import Feed from './Feed/Feed';
import Signup from './SignUp/SignUp';
import Login from './Login/Login';
import ProtectedRoute from './AuthContext/ProtectedRoute';
import { AuthProvider } from './AuthContext/AuthContext';

// AppContent is the main component that includes the application's routing logic.
const AppContent = () => {

  // Using useContext to access the current theme from ThemeContext.
  const { theme } = useContext(ThemeContext);

  // useEffect hook to apply the theme to the document's body. This runs whenever the theme changes.
  useEffect(() => {
    // Setting a data attribute on the body element for theme. This can be used in CSS to style elements based on the theme.
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <Router>
        {/* Using React Router for routing between different components/pages. */}
        <Routes>
          {/* Defining routes for the application. Each route renders a different component. */}
          <Route path="/" element={<Login />} />
          <Route path="/feed" element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
};

// App component wraps the whole application with ThemeProvider.
// ThemeProvider provides a theme context to all components inside it.
const App = () => (
  <AuthProvider>
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  </AuthProvider>
);

export default App;
