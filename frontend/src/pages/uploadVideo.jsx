import React, { useState } from 'react';
import axiosInstance from '../services/api';
import { useNavigate } from 'react-router-dom';

function UploadVideo() {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [thumbNail, setThumbNail] = useState(null);
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [duration, setDuration] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('thumbNail', thumbNail);
    formData.append('description', description);
    formData.append('isPublished', isPublished);
    formData.append('duration', duration);
    formData.append('videoFile', videoFile);

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
      setShowModal(false);
      navigate('/');
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Video upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Upload Video
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl relative">
            <h2 className="text-xl font-bold mb-4">Upload Video</h2>

            <input
              type="text"
              placeholder="Title"
              className="border p-2 w-full mb-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              className="border p-2 w-full mb-2"
              onChange={(e) => setThumbNail(e.target.files[0])}
            />

            <textarea
              placeholder="Description"
              className="border p-2 w-full mb-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="number"
              placeholder="Duration (in seconds)"
              className="border p-2 w-full mb-2"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <input
              type="file"
              accept="video/*"
              className="border p-2 w-full mb-2"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />

            <label className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={() => setIsPublished(!isPublished)}
              />
              <span>Publish</span>
            </label>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default UploadVideo;
