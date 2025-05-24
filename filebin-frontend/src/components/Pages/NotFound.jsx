import React, { useState, useEffect } from 'react';
import { IoSunny, IoMoon } from 'react-icons/io5';
import { Snowfall } from 'react-snowfall';

function NotFound() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      localStorage.setItem('darkMode', !prevMode);
      return !prevMode;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <>
      <div className="absolute flex justify-end p-2 w-full">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="inline-flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 w-10 h-10 text-gray-500 text-sm dark:text-gray-400 focus:outline-none"
        >
          {darkMode ? <IoSunny className="w-5 h-5" /> : <IoMoon className="w-5 h-5" />}
        </button>
      </div>

      <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-[#293132]' : 'bg-gray-300'}`}>
        {darkMode && (
          <Snowfall
            snowflakeCount={150}
            style={{
              position: 'fixed',
              width: '100vw',
              height: '100vh',
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
        )}
        
        <div className="relative z-10 text-center">
          <h1 className={`text-7xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>404</h1>
          <p className={`text-3xl mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Page Not Found</p>
          <p className="mt-6 text-5xl">😢</p>
          <p className={`mt-4 text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Oops! It seems you have lost your way.
          </p>
        </div>
      </div>
    </>
  );
}

export default NotFound;
