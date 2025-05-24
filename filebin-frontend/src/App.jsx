import React, { useState, useEffect } from 'react';
import { Snowfall } from 'react-snowfall';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/utils/ProtectedRoute';

import MainPage from './components/Home/MainPage';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import NotFound from './components/Pages/NotFound';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const updateDarkModeStatus = () => {
    const darkModeActive = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkModeActive);
  };

  useEffect(() => {
    updateDarkModeStatus();

    const observer = new MutationObserver(() => {
      updateDarkModeStatus();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Router>
     <div
        className={`min-h-screen relative ${
          isDarkMode ? 'bg-[#293132]' : 'bg-gray-300'
        }`}
      >
        <Toaster
          position="bottom-center"
          reverseOrder={false}
        />

        {isDarkMode && (
          <Snowfall
            snowflakeCount={200}
            style={{
              position: 'fixed',
              width: '100vw',
              height: '100vh',
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
        )}

        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/home/*" 
              element={
                <ProtectedRoute>
                  <MainPage />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
