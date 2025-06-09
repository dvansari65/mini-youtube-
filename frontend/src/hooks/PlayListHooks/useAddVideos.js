import { useState } from 'react';
import axiosInstance from '../../services/api';

function useAddVideos() {
  const [video, setVideo] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addVideosToThePlaylist = async (playListId, videoId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.post(`/playList/add-videos/${playListId}/${videoId}`);
      setVideo(res.data.data);
      setError('');
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to add video to playlist');
      console.error("Add video error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    video,
    loading,
    error,
    addVideosToThePlaylist,
    setVideo
  };
}

export default useAddVideos;
