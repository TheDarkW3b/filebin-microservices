import React, { useState } from 'react';
import { MdDeleteOutline } from "react-icons/md";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { MdContentPaste } from "react-icons/md";
import { MdDownloading } from "react-icons/md";
import { BsFiletypeRaw } from "react-icons/bs";
import { getToastStyles } from '../utils/toastStyles';
import toast from "react-hot-toast";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PasteCard({ pasteId, pasteName, uploadDate, pasteSize, pasteType, description, onDelete, isLiked, onLike }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleViewRaw = async () => {
        const rawUrl = `/api/v1/paste/${pasteId}/raw`;
    
        try {
            const response = await axios.get(rawUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 200) {
                const rawContent = response.data;
    
                const newWindow = window.open();
                newWindow.document.write(`<pre>${rawContent}</pre>`);
                newWindow.document.close();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong', {
                style: getToastStyles(),
            });
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get(`/api/v1/paste/download/${pasteId}`, {
                responseType: 'blob',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', pasteName);
                document.body.appendChild(link);

                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                toast.error('Failed to download paste', {
                    style: getToastStyles(),
                });
            }
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data?.message || 'Something went wrong', {
                    style: getToastStyles(),
                });
            } else {
                toast.error('Something went wrong', {
                    style: getToastStyles(),
                });
            }
        }
    }

    const toggleLike = async () => {
        try {
            const response = await axios.post(`/api/v1/paste/like/${pasteId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                if (response.data.message.includes("unliked")) {
                    toast('Unliked!', {
                        icon: '💔',
                        style: getToastStyles(),
                    });
                } else {
                    toast('Liked!', {
                        icon: '❤️',
                        style: getToastStyles(),
                    });
                }
                onLike(pasteId, !isLiked);
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
            } else {
                toast.error('Something went wrong', {
                    style: getToastStyles(),
                });
            }
        }
    }

    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`/api/v1/paste/delete/${pasteId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                toast.success('Deleted successfully!', {
                    style: getToastStyles(),
                });
                onDelete(pasteId);
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
            } else {
                toast.error('Something went wrong', {
                    style: getToastStyles(),
                });
            }
        }
        setIsModalOpen(false);
    };

    function formatPasteSize(size) {
        if (size < 1024) return `${size} B`;
        const i = Math.floor(Math.log(size) / Math.log(1024));
        const sizes = ['B', 'KB', 'MB'];
        return `${(size / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
    }

    function formatPasteType(pasteType) {
        if (pasteType.includes('.')) return pasteType.split('.').pop();
        return pasteType.split('/').pop();
    }

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div className="bg-gray-50 dark:bg-[#363847]/60 shadow-lg backdrop-blur-md mb-6 p-6 rounded-lg w-full">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                        <MdContentPaste className="mr-4 text-4xl text-black dark:text-gray-300" />
                        <h3 className="text-black text-xl dark:text-white">{pasteName}</h3>
                    </div>
                    <button className="text-2xl text-black dark:text-white" onClick={toggleLike}>
                        {isLiked ? (
                            <AiFillHeart className="text-red-500" />
                        ) : (
                            <AiOutlineHeart className="hover:text-red-500" />
                        )}
                    </button>
                </div>

                <hr className="border-gray-600 mb-4" />

                <div className="flex justify-between mb-4 text-gray-600 text-sm dark:text-gray-400">
                    <p>Size: {formatPasteSize(pasteSize)}</p>
                    <p>Type: {formatPasteType(pasteType)}</p>
                    <p>Description: {description && description.length > 20 ? `${description.slice(0, 20)}...` : description}</p>
                </div>

                <div className="flex items-center bg-yellow-50 dark:bg-[#363847]/90 shadow-lg mb-4 p-3 rounded-lg text-sm text-yellow-900 dark:text-yellow-600" role="alert">
                    <svg className="inline flex-shrink-0 mr-3 w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                    </svg>
                    <span className="font-medium">Upload date:</span>
                    <span className="ml-1">{uploadDate.split("T")[0]}</span>
                </div>

                <div className="flex justify-between items-center space-x-2">
                    <div className='flex gap-2'>

                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 bg-green-900 hover:bg-green-800 p-3 rounded-md font-semibold text-white"
                        >
                            <MdDownloading size={20} className="text-white" />
                            Download
                        </button>

                        <button
                            onClick={handleViewRaw}
                            className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 p-3 rounded-md font-semibold text-white"
                        >
                            <BsFiletypeRaw size={20} />
                            View Raw
                        </button>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 bg-red-800 hover:bg-red-700 p-3 rounded-md font-semibold text-white">
                        <MdDeleteOutline size={20} className="text-white" />
                        Delete
                    </button>
                </div>

            </div>

            {isModalOpen && (
                <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#363847]/80 shadow-lg backdrop-blur-md p-6 rounded-lg w-full max-w-sm">
                        <button onClick={closeModal} className="inline-flex top-3 right-2.5 absolute items-center bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-lg text-gray-300 text-sm">
                            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <div className="text-center">
                            <svg className="mx-auto mb-4 w-12 h-12 text-gray-400 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <h3 className="mb-5 font-normal text-gray-500 text-lg dark:text-gray-400">Are you sure you want to delete this paste?</h3>
                            <button
                                onClick={confirmDelete}
                                className="bg-red-600 hover:bg-red-800 px-5 py-2.5 rounded-lg focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 font-medium text-center text-sm text-white focus:outline-none">
                                Yes, I'm sure
                            </button>
                            <button
                                onClick={closeModal}
                                className="border-gray-200 dark:border-gray-600 bg-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 ml-3 px-5 py-2.5 border rounded-lg font-medium text-gray-900 text-sm dark:text-gray-400 focus:outline-none">
                                No, cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PasteCard;
