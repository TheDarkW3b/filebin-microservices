import React, { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import {
  MdContentPaste,
  MdOutlineFileDownload,
  MdFavoriteBorder,
  MdOutlineHistory,
  MdOutlineSettings,
  MdLogout,
  MdOutlineContentPasteSearch,
  MdOutlineReviews,
} from "react-icons/md";
import FeatureModal from "../Modal/FeatureModal";
import ReviewModal from "../Modal/ReviewModal";
import SettingsModal from "../Modal/SettingsModal";
import LogoutModal from "../Modal/LogoutModal";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getToastStyles } from "../utils/toastStyles";
import axios from "axios";

function SideBar({ closeSidebar }) {
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useState(() => {
    if (!token) {
      toast.error("You need to be logged in.", {
        style: getToastStyles(),
      });

      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/v1/user/me", {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) setProfile(response.data.user);
        else navigate("/login");
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data?.message || "Something went wrong", {
            style: getToastStyles(),
          });
        } else {
          toast.error("Something went wrong", {
            style: getToastStyles(),
          });
        }
      }
    };
    
    fetchUserData();
  }, [navigate]);

  const handleSave = (updatedProfile) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      ...updatedProfile,
    }));
  };

  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  const openHistoryModal = () => setIsHistoryModalOpen(true);
  const closeHistoryModal = () => setIsHistoryModalOpen(false);

  const openReviewModal = () => setIsReviewModalOpen(true);
  const closeReviewModal = () => setIsReviewModalOpen(false);

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  return (
    <div onClick={closeSidebar}>
      <aside
        className="bg-gray-50 dark:bg-[#363847]/60 backdrop-blur-md p-4 rounded-2xl sm:max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-6 p-6 divide-y divide-gray-600">
          <div className="flex items-center space-x-4 dark:text-white">
            {profile && (
              <>
                <img
                  className="rounded-full w-14 h-14"
                  src={profile.profilePicture}
                  alt="User Avatar"
                />
                <div>
                  <h2 className="font-semibold text-lg">{profile.username}</h2>
                  <span className="text-gray-600 text-sm dark:text-gray-400">
                    {profile.email}
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center items-center gap-4 pt-6 text-white">
            <Link
              to="upload-file"
              className="flex flex-col justify-center items-center gap-2 bg-purple-900 hover:bg-purple-800 p-4 rounded-lg w-24 h-24"
            >
              <AiOutlineCloudUpload size={40} />
              <p className="font-semibold text-sm">Upload</p>
            </Link>

            <Link
              to="create-paste"
              className="flex flex-col justify-center items-center gap-2 bg-orange-800 hover:bg-orange-700 p-4 rounded-lg w-24 h-24"
            >
              <MdContentPaste size={40} />
              <p className="font-semibold text-sm">Paste</p>
            </Link>

            <Link
              to="view-liked"
              className="flex flex-col justify-center items-center gap-2 bg-pink-900 hover:bg-pink-800 p-4 rounded-lg w-24 h-24"
            >
              <MdFavoriteBorder size={40} />
              <p className="font-semibold text-sm">Liked</p>
            </Link>
          </div>

          <ul className="space-y-4 pt-6">
            <li>
              <Link
                to="view-uploaded-files"
                className="flex items-center gap-3 font-semibold hover:text-gray-500 dark:hover:text-white dark:text-gray-300"
              >
                <MdOutlineFileDownload size={30} />
                View uploaded files
              </Link>
            </li>
            <li>
              <Link
                to="view-uploaded-pastes"
                className="flex items-center gap-3 font-semibold hover:text-gray-500 dark:hover:text-white dark:text-gray-300"
              >
                <MdOutlineContentPasteSearch size={30} />
                View pastes
              </Link>
            </li>
            <li>
              <button
                onClick={openHistoryModal}
                className="flex items-center gap-3 font-semibold hover:text-gray-500 dark:hover:text-white dark:text-gray-300"
              >
                <MdOutlineHistory size={30} />
                History
              </button>
            </li>
            <li>
              <button
                onClick={openReviewModal}
                className="flex items-center gap-3 font-semibold hover:text-gray-500 dark:hover:text-white dark:text-gray-300"
              >
                <MdOutlineReviews size={30} />
                Review
              </button>
            </li>
          </ul>

          <div className="border-gray-600 pt-6 border-t">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={openSettingsModal}
                  className="flex items-center gap-3 font-semibold hover:text-gray-500 dark:hover:text-white dark:text-gray-300"
                >
                  <MdOutlineSettings size={30} />
                  Settings
                </button>
              </li>
              <li>
                <div
                  onClick={openLogoutModal}
                  className="flex items-center gap-3 font-semibold text-red-600 hover:text-red-500 hover:cursor-pointer"
                >
                  <MdLogout size={30} />
                  <p>Log out</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <div onClick={handleModalClick}>
        <FeatureModal isOpen={isHistoryModalOpen} onClose={closeHistoryModal} />
        <ReviewModal isOpen={isReviewModalOpen} onClose={closeReviewModal} />
        {profile && (
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={closeSettingsModal}
            currentProfile={profile}
            onSave={handleSave}
          />
        )}
        <LogoutModal isOpen={isLogoutModalOpen} onClose={closeLogoutModal} />
      </div>
    </div>
  );
}

export default SideBar;
