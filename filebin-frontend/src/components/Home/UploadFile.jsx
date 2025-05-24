import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

import { getToastStyles } from "../utils/toastStyles";
import { useNavigate } from "react-router-dom";

function UploadFile() {
  const [fileNames, setFileNames] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);

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

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length > 0) {
      const names = selectedFiles.map((file) => file.name);
      setFileNames(names);
      setFiles(selectedFiles);
      setShowModal(true);
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("description", description);

    try {
      const response = await axios.post("/api/v1/file/upload", formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        toast.success("Upload successful!", {
          style: getToastStyles(),
        });
        setUploadSuccess(true);
        setShowModal(false);
      } else {
        toast.error("Problem with file or description", {
          style: getToastStyles(),
        });
      }
    } catch (error) {
      toast.error(
        "Upload failed. Please try again.",
        {
          style: getToastStyles(),
        }
      );
    } finally {
      setDescription("");
      setUploading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center gap-16 bg-gray-50 dark:bg-[#363847]/60 backdrop-blur-md p-8 rounded-2xl">
        <div className="flex flex-col justify-center items-center gap-4 text-center">
          <h1 className="font-medium text-5xl text-black dark:text-white">
            Upload Files, Share Them Easily
          </h1>
          <h2 className="font-serif text-3xl text-gray-500 dark:text-gray-300">
            ⭐File upload made easy
          </h2>
        </div>

        <div className="flex justify-center items-center w-full">
          <label
            htmlFor="dropzone-files"
            className="flex flex-col justify-center items-center border-2 border-gray-300 dark:border-gray-600 bg-gray-200 hover:bg-gray-100 dark:hover:bg-[#363847] dark:bg-gray-800/20 backdrop-blur-md dark:hover:blur-none border-dashed rounded-lg w-full h-64 cursor-pointer"
          >
            <div className="flex flex-col justify-center items-center pt-5 pb-6">
              <svg
                className="mb-4 w-8 h-8 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-gray-500 text-sm dark:text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-gray-500 text-xs dark:text-gray-400">
                JPEG, PNG, ZIP, DOCX, PDF, (MAX. 100MB)
              </p>
              {fileNames.length > 0 && (
                <p className="mt-2 text-gray-600 text-xs dark:text-gray-300">
                  Selected files:{" "}
                  <span className="font-semibold">{fileNames.join(", ")}</span>
                </p>
              )}
            </div>
            <input
              id="dropzone-files"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {uploadSuccess && (
          <div className="border-green-800 bg-green-900 mt-4 p-4 border rounded-lg font-semibold text-white">
            {fileNames.length} file(s) uploaded successfully!
          </div>
        )}
      </div>

      {showModal && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="relative bg-white dark:dark:bg-[#363847]/60 shadow backdrop-blur-md p-4 rounded-lg w-full max-w-md max-h-full">
            <button
              onClick={closeModal}
              className="inline-flex top-3 right-2.5 absolute items-center bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 p-1.5 rounded-lg text-black text-sm dark:text-gray-300"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="p-6 text-center">
              {uploading ? (
                <div className="flex flex-col items-center gap-4">
                  <svg
                    aria-hidden="true"
                    className="w-14 h-14 text-gray-200 dark:text-gray-600 animate-spin fill-green-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="ml-3 dark:text-gray-300">Uploading...</span>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto mb-4 w-12 h-12 text-gray-400 dark:text-gray-200"
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
                      d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <h3 className="mb-5 font-normal text-gray-500 text-lg dark:text-gray-400">
                    Are you sure you want to upload {fileNames.length} file(s)?
                  </h3>

                  <input
                    className="border-gray-300 dark:border-gray-600 dark:bg-[#363847]/40 mb-4 p-3 border focus:border-blue-500 dark:focus:border-blue-500 rounded-lg focus:ring-blue-500 dark:focus:ring-blue-500 w-full text-gray-900 dark:text-gray-300 dark:placeholder-gray-400"
                    placeholder="Add a description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></input>

                  <button
                    onClick={handleUpload}
                    className="inline-flex items-center bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-lg focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800 font-medium text-center text-sm text-white focus:outline-none"
                  >
                    Yes, upload
                  </button>
                  <button
                    onClick={closeModal}
                    className="focus:z-10 border-gray-200 dark:border-gray-600 bg-white hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-800 px-5 py-2.5 border rounded-lg focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 font-medium text-gray-900 text-sm hover:text-blue-700 dark:hover:text-white dark:text-gray-400 focus:outline-none ms-3"
                  >
                    No, cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadFile;
