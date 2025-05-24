import React, { useState, useEffect } from 'react';
import { IoSunny, IoMoon, IoReorderThreeSharp } from 'react-icons/io5';
import SideBar from './SideBar';

function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <>
    <nav className="border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-[#363847]/60 backdrop-blur-md">
      <div className="flex flex-wrap justify-between items-center mx-auto p-4 max-w-screen-xl">
        <a href="#" className="flex items-center space-x-1 rtl:space-x-reverse">
          <img src="/logo.png" className="relative h-10 w-12" alt="Flowbite Logo" />
          <span className="font-semibold text-2xl dark:text-white whitespace-nowrap self-center">FileBin</span>
        </a>
        <div className='flex justify-center gap-2'>
          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex justify-center items-center md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 text-gray-500 text-sm dark:text-gray-400 focus:outline-none"
          >
            <IoReorderThreeSharp size={35} />
          </button>
          <button
            type="button"
            onClick={toggleDarkMode}
            className="inline-flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 w-10 h-10 text-gray-500 text-sm dark:text-gray-400 focus:outline-none"
          >
            {darkMode ? <IoSunny className="w-5 h-5" /> : <IoMoon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </nav>

    {isSidebarOpen && (
        <div className="z-50 absolute backdrop-blur-md mt-1 w-full min-h-screen" onClick={toggleSidebar}>
            <SideBar />
        </div>
      )}
</>
  );
}

export default Navbar;
