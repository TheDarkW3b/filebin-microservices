import React, { useState } from "react";
import { MdContentPaste } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "axios";
import { getToastStyles } from "../utils/toastStyles";

import "./ScrollBar.css";
import { useNavigate } from "react-router-dom";

function CreatePaste() {
  const [creatingPaste, setCreatingPaste] = useState(false);
  const [pasteName, setPasteName] = useState("");
  const [contentType, setContentType] = useState("");
  const [description, setDescription] = useState("");
  const [pasteContent, setPasteContent] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pasteContent.trim() === "") {
      toast.error("Paste content cannot be empty!", {
        style: getToastStyles(),
      });
      return;
    }
    setCreatingPaste(true);
  };

  const handleCreatePaste = async (e) => {
    e.preventDefault();

    if (
      pasteName.trim() === "" ||
      contentType.trim() === "" ||
      description.trim() === ""
    ) {
      toast.error("Please fill in all required fields.", {
        style: getToastStyles(),
      });
      return;
    }

    const newPaste = {
      pasteName: pasteName,
      content: pasteContent,
      contentType: contentType,
      description: description,
    };

    try {
      const response = await axios.post(
        "/api/v1/paste/create-paste",
        newPaste,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Paste created successfully!", {
          style: getToastStyles(),
        });
      } else {
        toast.error(response.data.message || "Failed to create paste", {
          style: getToastStyles(),
        });
      }

      setCreatingPaste(false);
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
      setCreatingPaste(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-50 dark:bg-[#363847]/60 backdrop-blur-md p-8 rounded-2xl"
      >
        <div className="text-center">
          <h1 className="mb-2 font-medium text-5xl text-black dark:text-white">
            Create Paste
          </h1>
          <h2 className="font-serif text-3xl text-gray-500 dark:text-gray-300">
            ⭐Sharing your texts easily
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          <label
            htmlFor="message"
            className="block font-medium text-gray-700 dark:text-gray-300"
          >
            New Paste Content:
          </label>
          <textarea
            id="pasteContent"
            rows="16"
            className="block border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#363847]/60 backdrop-blur-md custom-scrollbar p-2.5 border focus:border-blue-500 dark:focus:border-blue-500 rounded-lg focus:ring-blue-500 dark:focus:ring-blue-500 w-full text-gray-900 text-sm dark:text-white dark:placeholder-gray-400"
            placeholder="Write your paste here..."
            value={pasteContent}
            onChange={(e) => setPasteContent(e.target.value)}
            required
          ></textarea>

          <button
            type="submit"
            className="bg-green-800 hover:bg-green-700 mt-3 p-3 rounded-lg font-semibold text-white transition duration-300"
          >
            Create Paste
          </button>
        </div>
      </form>

      {creatingPaste && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white dark:dark:bg-[#363847]/60 shadow backdrop-blur-md p-6 rounded-lg w-full max-w-md max-h-full">
            <button
              onClick={() => setCreatingPaste(false)}
              className="top-3 right-3 absolute bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-lg text-black text-sm dark:text-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <form className="text-center" onSubmit={handleCreatePaste}>
              <div className="flex flex-col items-center gap-2">
                <MdContentPaste
                  size={60}
                  className="text-gray-600 dark:text-gray-400"
                />
                <h3 className="mb-5 font-normal text-gray-500 text-lg dark:text-gray-400">
                  Confirm your new paste creation
                </h3>
              </div>

              <input
                type="text"
                placeholder="Paste Name"
                className="border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#363847]/40 mb-4 p-3 border rounded-lg w-full text-gray-900 dark:text-gray-300 dark:placeholder-gray-400"
                value={pasteName}
                onChange={(e) => setPasteName(e.target.value)}
              />

              <select
                className="border-gray-300 dark:focus:border-white dark:border-gray-600 bg-gray-100 dark:bg-[#363847]/40 mb-4 p-3 border rounded-lg dark:focus:ring-white w-full text-black dark:text-gray-300"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                <option
                  value=""
                  className="bg-white dark:bg-gray-700 text-black dark:text-white"
                  disabled
                >
                  Select Content Type
                </option>
                <option
                  value="text"
                  className="bg-white dark:bg-gray-700 text-black dark:text-white"
                >
                  Text
                </option>
                <option
                  value="code"
                  className="bg-white dark:bg-gray-700 text-black dark:text-white"
                >
                  Code
                </option>
                <option
                  value="markdown"
                  className="bg-white dark:bg-gray-700 text-black dark:text-white"
                >
                  Markdown
                </option>
              </select>

              <textarea
                placeholder="Add a description..."
                className="border-gray-300 dark:focus:border-green-500 dark:border-gray-600 bg-gray-100 dark:bg-[#363847]/40 mb-4 p-3 border rounded-lg dark:focus:ring-green-500 w-full text-gray-900 dark:text-gray-300 dark:placeholder-gray-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              ></textarea>

              <button
                type="submit"
                className="inline-flex items-center bg-red-600 hover:bg-red-700 mr-2 px-5 py-2.5 rounded-lg focus:ring-4 font-medium text-sm text-white focus:outline-none"
              >
                Yes, create paste
              </button>
              <button
                onClick={() => setCreatingPaste(false)}
                className="border-gray-200 dark:border-gray-600 bg-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 px-5 py-2.5 border rounded-lg font-medium text-gray-900 text-sm dark:hover:text-white dark:text-gray-400"
              >
                No, cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CreatePaste;
