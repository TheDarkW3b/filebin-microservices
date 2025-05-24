import React from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import toast from "react-hot-toast";

import { getToastStyles } from '../utils/toastStyles';

function LogoutModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const navigate = useNavigate();
    const { logout } = useAuth(); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        
        logout();

        toast.success('Logged out successfully', {
            style: getToastStyles(),
        });

        navigate('/login');
        onClose();
    };

    return (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm p-3 md:p-0 overflow-auto">
            <div className="bg-white dark:bg-[#363847]/60 shadow-lg backdrop-blur-md rounded-lg w-full max-w-md">
                <button onClick={onClose} className="inline-flex top-3 right-2.5 absolute items-center bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-lg text-sm dark:text-gray-300">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-4 md:p-5 text-center">
                    <AiOutlineLogout className="mx-auto mb-4 w-12 h-12 text-red-600 dark:text-white" />
                    <h3 className="mb-5 font-normal text-gray-500 text-lg dark:text-gray-400">Are you sure you want to log out?</h3>
                    <button
                        onClick={handleLogout}
                        type="button"
                        className="inline-flex items-center bg-red-600 hover:bg-red-800 px-5 py-2.5 rounded-lg focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 font-medium text-center text-sm text-white focus:outline-none">
                        Yes, log me out
                    </button>
                    <button
                        onClick={onClose}
                        type="button"
                        className="focus:z-10 border-gray-200 dark:border-gray-600 bg-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 px-5 py-2.5 border rounded-lg focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 font-medium text-gray-900 text-sm hover:text-blue-700 dark:hover:text-white dark:text-gray-400 focus:outline-none ms-3">
                        No, cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogoutModal;
