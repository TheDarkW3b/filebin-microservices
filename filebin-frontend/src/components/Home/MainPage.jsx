import React from 'react';
import NavBar from './Navbar';
import SideBar from './SideBar';
import UploadFile from './UploadFile';
import CreatePaste from './CreatePaste';
import ViewUploadedPastes from '../Pages/ViewUploadedPastes';
import ViewLiked from '../Pages/ViewLiked';
import ViewUploadedFiles from '../Pages/ViewUploadedFiles';
import { Routes, Route, Navigate } from 'react-router-dom';
import './MainPage.css';

function MainPage() {
    return (
        <>
            <NavBar />
            <div className="flex justify-center gap-10 max-w-screen-xl mx-auto p-4 h-screen">
                <div className='hidden md:block'>
                    <SideBar />
                </div>

                <main
                    id="main-content"
                    className={`flex-1 text-white scroll-content hide-scrollbar`}
>
                    <Routes>
                        <Route path="/" element={<Navigate to="upload-file" />} />
                        <Route path="upload-file" element={<UploadFile />} />
                        <Route path="create-paste" element={<CreatePaste />} />
                        <Route path="view-uploaded-files" element={<ViewUploadedFiles />} />
                        <Route path="view-uploaded-pastes" element={<ViewUploadedPastes />} />
                        <Route path="view-liked" element={<ViewLiked />} />

                        <Route path="*" element={<Navigate to="/page-not-found" />} />
                    </Routes>
                </main>
            </div>
        </>
    );
}

export default MainPage;
