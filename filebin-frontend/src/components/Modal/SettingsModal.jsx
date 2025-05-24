import React, { useState } from 'react';
import { AiOutlineCamera } from "react-icons/ai";
import toast from "react-hot-toast";
import axios from "axios";
import { getToastStyles } from '../utils/toastStyles';
import { useNavigate } from 'react-router-dom';

function SettingsModal({ isOpen, onClose, currentProfile, onSave }) {
    if (!isOpen) return null;
    
    const [profilePicture, setProfilePicture] = useState(currentProfile.profilePicture);
    const [username, setUsername] = useState(currentProfile.username);
    const [email, setEmail] = useState(currentProfile.email);
    const [password, setPassword] = useState('');

    const token = localStorage.getItem('token');
    const navigate = useNavigate();
  
    useState(() => {
      if (!token) {
        toast.error('You need to be logged in.', {
          style: getToastStyles(),
        });
  
        navigate('/login');
      }
    }, []);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post("/api/v1/user/change/profile-picture", formData, {
                headers: {
                    'Authorization' : `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setProfilePicture(response.data.profileUrl);
                onSave({ profilePicture: response.data.profileUrl });
                toast.success('Profile picture updated', {
                    style: getToastStyles(),
                });
            } else {
                toast.error(response.data.message, {
                    style: getToastStyles(),
                });
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data?.message || 'Something went wrong', {
                    style: getToastStyles(),
                });
            }else {
                toast.error('Something went wrong', {
                    style: getToastStyles(),
                });
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const updateData = {};

        if (username !== currentProfile.username) updateData.username = username;
        if (email !== currentProfile.email) updateData.email = email;
        if (password) updateData.password = password;

        if (Object.keys(updateData).length === 0) {
            toast.success('Saved', {
                style: getToastStyles(),
            });
            onClose();
            return;
        }

        try {
            const response = await axios.post("/api/v1/user/update", updateData, {
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type' : 'application/json'
                }
            });

            if (response.status === 200) {
                toast.success('Saved', {
                    style: getToastStyles(),
                });
                onSave({ username, email });
                setPassword('');
                onClose();
            } else {
                toast.error(response.data.message, {
                    style: getToastStyles(),
                });
            }
        } catch (error) {
            toast.error('Something went wrong', {
                style: getToastStyles(),
            });
            onClose();
        }
    };
    
    return (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm p-3 md:p-0 overflow-auto">
            <div className="bg-white dark:bg-[#363847]/60 shadow-lg backdrop-blur-md rounded-lg w-full max-w-lg">
                <div className="flex justify-between items-center dark:border-gray-600 p-4 border-b">
                    <h3 className="font-semibold text-gray-900 text-lg dark:text-white">
                        Edit Profile Settings
                    </h3>
                    <button onClick={onClose} className="inline-flex items-center bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-lg text-sm dark:text-gray-300">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4 p-4">
                    <div className="flex justify-center">
                        <label htmlFor="myFile" className="relative cursor-pointer">
                            <img src={profilePicture} alt="Profile" className="opacity-100 hover:opacity-70 rounded-full w-28 h-28 transition-opacity duration-300" />
                            <input type="file" className="hidden" id="myFile" onChange={handleFileChange} />
                            <div className="top-0 right-0 bottom-0 left-0 absolute flex flex-col justify-center items-center gap-1 bg-black bg-opacity-50 opacity-0 hover:opacity-100 rounded-full transition-opacity duration-300">
                                <AiOutlineCamera size={30} className="text-white" />
                                <span className="text-white">Edit Profile</span>
                            </div>
                        </label>
                    </div>

                    <hr className="border-gray-300 dark:border-gray-600 my-4" />

                    <div>
                        <label className="block font-medium text-gray-700 text-sm dark:text-white">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="block border-gray-500 dark:bg-gray-600/80 shadow-sm mt-1 p-2 border rounded-md w-full dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 text-sm dark:text-white">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block border-gray-500 dark:bg-gray-600/80 shadow-sm mt-1 p-2 border rounded-md w-full dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-gray-700 text-sm dark:text-white">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder='**********'
                            className="block border-gray-500 dark:bg-gray-600/80 shadow-sm mt-1 p-2 border rounded-md w-full dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 dark:hover:bg-red-600 dark:bg-red-700 mr-2 px-4 py-2 rounded-lg text-gray-700 text-sm dark:text-white">
                            Cancel
                        </button>
                        <button type="submit" className="bg-indigo-800 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm text-white">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SettingsModal;
