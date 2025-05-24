import React from 'react';
import { MdOutlineHistory } from 'react-icons/md';

function FeatureModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="p-3 md:p-0 fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 dark:bg-[#363847]/80 backdrop-blur-md">
                <div className="absolute top-2 right-2">
                    <button onClick={onClose} className="absolute top-3 right-2.5 dark:text-gray-300 bg-transparent hover:bg-gray-200 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-700">
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="text-center">
                    <MdOutlineHistory
                        size={50}
                        className="text-gray-500 mx-auto mb-4 dark:text-gray-300"
                    />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                        Feature Not Available
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        The "History" feature is not available at the moment. It will be available in future updates.
                    </p>
                    <button
                        className="mt-4 bg-red-700 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FeatureModal;
