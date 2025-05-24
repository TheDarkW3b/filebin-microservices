import React, { useState, useEffect } from "react";
import PasteCard from "../Cards/PasteCard";
import { MdOutlineFilterAlt } from "react-icons/md";
import axios from "axios";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";

function ViewUploadedPastes() {
  const [pastes, setPastes] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const itemsPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    fileType: "all",
    subject: "all",
  });

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

  const fetchPastes = async (page) => {
    try {
      const response = await axios.get(
        `/api/v1/paste/get-pastes?page=${page - 1}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) return;
      setPastes(response.data.content);
      setTotalPages(Math.ceil(response.data.totalElements / itemsPerPage));
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

  useEffect(() => {
    fetchPastes(currentPage);
  }, [currentPage]);

  useEffect(() => {
    applyFilters(pastes);
  }, [pastes, filters, searchTerm]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = (pastesToFilter) => {
    const filtered = pastesToFilter.filter((item) => {
      const itemType = item.contentType;
      const subject = item.description || "No Description";

      if (filters.fileType !== "all" && itemType !== filters.fileType) {
        return false;
      }

      if (filters.subject !== "all" && subject !== filters.subject) {
        return false;
      }

      if (
        searchTerm &&
        !item.pasteName.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });

    setFilteredItems(filtered);
  };

  const handleDeletePaste = (deletedPasteId) =>
    setFilteredItems((prevFilteredItems) =>
      prevFilteredItems.filter((paste) => paste.id !== deletedPasteId)
    );

  const handleLikedPaste = (likedPasteId, likedValue) => {
    setFilteredItems((prevFilteredItems) =>
      prevFilteredItems.map((paste) =>
        paste.id === likedPasteId ? { ...paste, liked: likedValue } : paste
      )
    );
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  return (
    <div className="mx-auto w-full">
      <div className="flex md:flex-row flex-col justify-between gap-4 md:gap-0 mb-6">
        <form className="flex-1 md:mr-4">
          <label htmlFor="default-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block border-gray-300 focus:border-cyan-500 dark:focus:border-cyan-500 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/60 p-2.5 pl-10 border rounded-md focus:ring-blue-500 dark:focus:ring-cyan-500 w-full text-gray-900 text-sm dark:text-white dark:placeholder-gray-400"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={handleSearchChange}
              required
            />
            <button
              type="submit"
              className="top-1/2 right-0 absolute bg-blue-600 hover:bg-blue-700 dark:hover:bg-cyan-700 dark:bg-cyan-800 px-3 p-[9px] rounded-md focus:ring-4 focus:ring-blue-300 dark:focus:ring-cyan-900 font-medium text-sm text-white transform -translate-y-1/2 focus:outline-none"
              onClick={(e) => e.preventDefault()}
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex justify-between items-center gap-4">
          <div className="relative flex items-center w-full max-w-xs">
            <MdOutlineFilterAlt className="left-2 absolute w-5 h-5 text-gray-500 dark:text-white" />
            <select
              name="fileType"
              value={filters.fileType}
              onChange={handleFilterChange}
              className="border-gray-300 bg-gray-50 dark:bg-gray-700/60 py-2 pl-10 border rounded-md w-full text-black dark:text-white"
            >
              <option
                value="all"
                className="bg-white dark:bg-gray-700/80 text-black dark:text-white"
              >
                All Types
              </option>
              <option
                value="Text"
                className="bg-white dark:bg-gray-700/80 text-black dark:text-white"
              >
                Text
              </option>
              <option
                value="Code"
                className="bg-white dark:bg-gray-700/80 text-black dark:text-white"
              >
                Code
              </option>
              <option
                value="Markdown"
                className="bg-white dark:bg-gray-700/80 text-black dark:text-white"
              >
                Markdown
              </option>
            </select>
          </div>

          <div className="relative flex items-center w-full max-w-xs">
            <MdOutlineFilterAlt className="left-2 absolute w-5 h-5 text-gray-500 dark:text-white" />
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="border-gray-300 bg-gray-50 dark:bg-gray-700/60 py-2 pl-10 border rounded-md w-full text-black dark:text-white"
            >
              <option
                value="all"
                className="bg-white dark:bg-gray-700/80 text-black dark:text-white"
              >
                All Subjects
              </option>
              <option
                value="Important Notes"
                className="bg-white dark:bg-gray-700/80 text-black dark:text-white"
              >
                Important Notes
              </option>
              <option
                value="Code Snippet"
                className="bg-white dark:bg-gray-700/80 text-black dark:text-white"
              >
                Code Snippet
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Main content area with padding and overflow settings */}
      {/* <div className='max-h-[35rem] overflow-auto hide-scrollbar'> */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col justify-center items-center mt-8 h-full">
          <span className="mb-4 text-5xl">📋</span>
          <p className="font-semibold text-2xl text-gray-700 sm:text-3xl md:text-gray-300">
            No pastes found.
          </p>
          <p className="mt-2 text-gray-500 md:text-gray-400">
            You can create a new paste to get started!
          </p>
        </div>
      ) : (
        filteredItems.map((paste, index) => (
          <PasteCard
            key={index}
            pasteId={paste.id}
            pasteName={paste.pasteName}
            uploadDate={paste.uploadTime}
            pasteSize={paste.size}
            pasteType={paste.contentType}
            description={paste.description}
            onDelete={handleDeletePaste}
            isLiked={paste.liked}
            onLike={handleLikedPaste}
          />
        ))
      )}
      {/* </div> */}

      <nav aria-label="Page navigation example" className="mt-6">
        <ul className="flex justify-center items-center -space-x-px h-10 text-base">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex justify-center items-center border-e-0 border-gray-300 dark:border-gray-700 bg-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-[#363847]/60 backdrop-blur-md px-4 border rounded-s-lg h-10 text-gray-500 hover:text-gray-700 dark:hover:text-white dark:text-gray-400 leading-tight ms-0"
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-3 h-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index}>
              <button
                onClick={() => handlePageChange(index + 1)}
                className={`flex items-center justify-center px-4 h-10 leading-tight ${
                  currentPage === index + 1
                    ? "text-black dark:text-gray-200 bg-gray-200 dark:bg-gray-700 dark:border-gray-700"
                    : "text-black bg-white dark:text-gray-300 hover:bg-gray-200 dark:bg-[#363847]/60 backdrop-blur-md dark:hover:bg-gray-700"
                }`}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex justify-center items-center border-gray-300 dark:border-gray-700 bg-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-[#363847]/60 backdrop-blur-md px-4 border rounded-e-lg h-10 text-gray-500 hover:text-gray-700 dark:hover:text-white dark:text-gray-400 leading-tight"
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-3 h-3 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ViewUploadedPastes;
