import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoSunny, IoMoon } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { getToastStyles } from "../utils/toastStyles";

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true" ? true : false;
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match", {
        style: getToastStyles(),
      });
      return;
    }

    try {
      const response = await axios.post("/api/v1/user/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      if (response.status === 201) {
        toast.success("Registration successful!", {
          style: getToastStyles(),
        });

        navigate("/login");
      } else {
        toast.error(response.data.message, {
          style: getToastStyles(),
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message, {
          style: getToastStyles(),
        });
      } else {
        toast.error("Registration failed. Please try again.", {
          style: getToastStyles(),
        });
      }
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  return (
    <>
      <div className="absolute flex justify-end p-2 w-full">
        <button
          type="button"
          onClick={toggleDarkMode}
          className="inline-flex right-0 justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 w-10 h-10 text-gray-500 text-sm dark:text-gray-400 focus:outline-none"
        >
          {darkMode ? (
            <IoSunny className="w-5 h-5" />
          ) : (
            <IoMoon className="w-5 h-5" />
          )}
        </button>
      </div>

      <section className="flex justify-center items-center bg-gray-50 dark:bg-transparent p-4 md:p-0 min-h-screen">
        <div className="flex flex-col justify-center items-center w-full max-w-md">
          <a
            href="#"
            className="flex items-center mb-6 font-semibold text-2xl text-gray-900 dark:text-white"
          >
            <img
              className="w-16 h-16"
              src="/logo.png"
              alt="logo"
            />
            FileBin
          </a>
          <div className="dark:border-gray-700 bg-white dark:bg-[#363847]/60 shadow-gray-500 shadow-lg dark:shadow-none backdrop-blur-md dark:border rounded-lg w-full sm:max-w-lg">
            <div className="space-y-6 p-8 md:p-10">
              <h1 className="font-bold text-gray-900 text-xl dark:text-white leading-tight tracking-tight">
                Create an account
              </h1>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 font-medium text-gray-900 text-sm dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    className="block border-gray-300 focus:border-primary-600 dark:border-gray-600 bg-gray-50 bg-transparent dark:bg-[#4F5165] p-2.5 border rounded-lg focus:ring-primary-600 w-full text-gray-900 dark:text-white dark:placeholder-gray-400"
                    placeholder="n***r"
                    required
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 font-medium text-gray-900 text-sm dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block border-gray-300 focus:border-primary-600 dark:border-gray-600 bg-gray-50 bg-transparent dark:bg-[#4F5165] p-2.5 border rounded-lg focus:ring-primary-600 w-full text-gray-900 dark:text-white dark:placeholder-gray-400"
                    placeholder="name@filebin.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 font-medium text-gray-900 text-sm dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="block border-gray-300 focus:border-[primary-600] dark:border-gray-600 bg-gray-50 dark:bg-[#4F5165] p-2.5 border rounded-lg focus:ring-[#13304e] w-full text-gray-900 dark:text-white dark:placeholder-gray-400"
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 font-medium text-gray-900 text-sm dark:text-white"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="••••••••"
                    className="block border-gray-300 focus:border-primary-600 dark:border-gray-600 bg-gray-50 dark:bg-[#4F5165] p-2.5 border rounded-lg focus:ring-[#13304e] w-full text-gray-900 dark:text-white dark:placeholder-gray-400"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 border rounded focus:ring-3 focus:ring-primary-300 w-4 h-4"
                      required
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <a
                        href="#"
                        className="font-medium text-primary-600 dark:text-sky-500 hover:underline"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 dark:hover:bg-[#476383] dark:bg-[#547AA5] px-5 py-2.5 rounded-lg focus:ring-4 focus:ring-primary-300 w-full font-medium text-center text-sm text-white focus:outline-none"
                >
                  Create an account
                </button>
                <p className="font-light text-gray-500 text-sm dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-primary-600 dark:text-sky-500 hover:underline"
                  >
                    Login here
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;
