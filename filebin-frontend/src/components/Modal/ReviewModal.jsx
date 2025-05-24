import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import toast from "react-hot-toast";
import axios from 'axios';

import { getToastStyles } from '../utils/toastStyles';

function ReviewModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.name.trim() === '' || formData.email.trim() === '' || formData.message.trim() === '') {
            toast.error('Please fill in all required fields.', {
                style: getToastStyles(),
            });
            return;
        }

        if (!isValidEmail(formData.email.trim())) {
            toast.error('Invalid email.', {
                style: getToastStyles(),
            });
            return;
        }

        try {
            const response = await axios.post('https://formspree.io/f/xzbnojvk', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', 
                }
            });

            if (response.status === 200) {
                toast.success('Thanks for the review', {
                    style: getToastStyles(),
                });
            }
        } catch (error) {
            toast.success('Thanks for the review', {
                style: getToastStyles(),
            });
        }
        onClose();
    }


    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    
    return (
        <div className="p-3 md:p-0 fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#363847]/60 backdrop-blur-md rounded-lg shadow-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center pb-4 border-b border-gray-300 dark:border-gray-600 mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Leave a Review</h2>
                    <button onClick={onClose} className="dark:text-gray-300 bg-transparent hover:bg-gray-200 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-700">
                        <AiOutlineClose size={24} />
                    </button>
                </div>
                <form className="space-y-8 mt-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700/80 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700/80 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Your Review</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="6"
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700/80 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Write your review..."
                            value={formData.message}
                            onChange={handleChange}
                        >
                        </textarea>
                    </div>

                    <button
                        type="submit"
                        className="py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-red-800 w-full hover:bg-red-700 dark:bg-red-800 dark:hover:bg-red-700"
                    >
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ReviewModal;
