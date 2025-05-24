import React, { useState } from 'react';
import axiosInstance from '../services/api';
import { NavLink, useNavigate } from 'react-router-dom';

function UploadVideo() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [thumbNail, setThumbNail] = useState(null);
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [duration, setDuration] = useState('');
  const [videos, setVideos] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    setError('');
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('thumbNail', thumbNail);
    formData.append('description', description);
    formData.append('isPublished', isPublished.toString());
    formData.append('duration', duration);
    formData.append('videos', videos);

    try {
      const response = await axiosInstance.post('/videos/upload-content', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.data) {
        setError("Couldn't get a valid response from server.");
        setLoading(false);
        return;
      }

      console.log('Video uploaded:', response.data);
      setError("");
      navigate('/');
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Video upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-start py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Video</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter video title"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter video description"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Duration (in seconds)
            </label>
            <input
              type="number"
              placeholder="Enter video duration"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setThumbNail(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Video File
            </label>
            <input
              type="file"
              accept="video/*"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onChange={(e) => setVideos(e.target.files[0])}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="publish"
              checked={isPublished}
              onChange={() => setIsPublished(!isPublished)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="publish" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Publish immediately
            </label>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <div className="flex justify-end space-x-4 pt-4">
            <NavLink
              to="/"
              className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </NavLink>
            <button
              onClick={handleUpload}
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadVideo;
