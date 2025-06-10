import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

import useUpdatePlaylist from "../hooks/playlistHooks/updatePlaylist.js";


const PlaylistEditModal = ({ isOpen, onClose, onSave, playlist }) => {
  const {updatedPlaylist,setUpdatedPlaylist,UpdatePlaylist,error:updatedError,loading:updateLoading} = useUpdatePlaylist(playlist._id)
  useEffect(()=>{
    if(playlist){
      setUpdatedPlaylist({
        title:updatedPlaylist.title || "",
        description:updatedPlaylist.description || ""
      })
    }
  },[playlist,setUpdatedPlaylist])

  const handleSave = async()=>{
      await UpdatePlaylist()
      onSave();
      onClose()
  }
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          Edit Playlist
        </h2>
        {updatedError && <div className="text-red-500 text-xl">{updatedError}</div>}

        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
            value={updatedPlaylist.title}
            onChange={(e) => setUpdatedPlaylist(prev=>(
              {
                ...prev,
                title:e.target.value
              }
            ))}
            placeholder="Enter playlist title"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
            Description
          </label>
          <textarea
            className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:text-white"
            rows={4}
            value={description}
            onChange={(e) => setUpdatedPlaylist(prev=>(
              {
                ...prev,
               description:e.target.value
              }
            ))}
            placeholder="Enter playlist description"
          ></textarea>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
        >
         { updateLoading ? "saving..." : "save"}
        </button>
      </div>
    </div>
  );
};

export default PlaylistEditModal;
