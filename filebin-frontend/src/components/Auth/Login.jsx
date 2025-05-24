import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { IoSunny, IoMoon } from 'react-icons/io5';
import { getToastStyles } from '../utils/toastStyles';
import { useAuth } from '../utils/AuthContext'; 
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const { login } = useAuth(); 
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const postData = {
        "username": username,
        "password": password,
      };

      const response = await axios.post('/api/v1/user/login', postData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast.success('Login successful!', {
          style: getToastStyles(),
        });

        const token = response.data.user.token;
        login(token);
        
        navigate('/home');
      } else {
        toast.error(response.data.message || 'Login failed', {
          style: getToastStyles(),
        });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message, {
          style: getToastStyles(),
        });
      } else {
        toast.error('Something went wrong', {
          style: getToastStyles(),
        });
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  return (
    <>
      <div className='absolute flex justify-end p-1 w-full'>
        <button
          type="button"
          onClick={toggleDarkMode}
          className="inline-flex right-0 justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 w-10 h-10 text-gray-500 text-sm dark:text-gray-400 focus:outline-none"
        >
          {darkMode ? <IoSunny className="w-5 h-5" /> : <IoMoon className="w-5 h-5" />}
        </button>
      </div>
      <section className="flex justify-center items-center bg-gray-50 dark:bg-transparent min-h-screen">

        <div className="flex flex-col justify-center items-center p-4 md:p-0 w-full max-w-md">
          <a href="#" className="flex items-center mb-6 font-semibold text-2xl text-gray-900 dark:text-white">
            <img className="w-16 h-16" src="/logo.png" alt="logo" />
            FileBin
          </a>
          <div className="dark:border-gray-700 bg-white/10 dark:bg-[#363847]/60 shadow-gray-500 shadow-lg dark:shadow-none backdrop-blur-md dark:border rounded-lg w-full sm:max-w-lg">
            <div className="space-y-6 p-8 md:p-10">
              <h1 className="font-bold text-gray-900 text-xl dark:text-white leading-tight tracking-tight">
                Sign in to your account
              </h1>
              <form className="space-y-4" onSubmit={handleLogin}>
                <div>
                  <label htmlFor="username" className="block mb-2 font-medium text-gray-900 text-sm dark:text-white">Username or email</label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="block border-gray-300 focus:border-primary-600 dark:border-gray-600 bg-gray-50 bg-transparent dark:bg-[#4F5165] p-2.5 border rounded-lg focus:ring-primary-600 w-full text-gray-900 dark:text-white dark:placeholder-gray-400"
                    placeholder="name@filebin.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-2 font-medium text-gray-900 text-sm dark:text-white">Password</label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block border-gray-300 focus:border-[primary-600] dark:border-gray-600 bg-gray-50 dark:bg-[#4F5165] p-2.5 border rounded-lg focus:ring-[#13304e] w-full text-gray-900 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 border rounded focus:ring-3 focus:ring-primary-300 w-4 h-4"
                        required=""
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                    </div>
                  </div>
                  <a href="#" className="font-medium text-primary-600 text-sm dark:text-sky-500 hover:underline">Forgot password?</a>
                </div>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 dark:hover:bg-[#476383] dark:bg-[#547AA5] px-5 py-2.5 rounded-lg focus:ring-4 focus:ring-primary-300 w-full font-medium text-center text-sm text-white focus:outline-none"
                >
                  Sign in
                </button>
                <p className="font-light text-gray-500 text-sm dark:text-gray-400">
                  Don’t have an account yet? <Link to="/register" className="font-medium text-primary-600 dark:text-sky-500 hover:underline">Sign up</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Login;
