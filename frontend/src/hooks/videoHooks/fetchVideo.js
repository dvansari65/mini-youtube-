import { useEffect, useState } from 'react';
import axiosInstance from '../../services/api';

function useFetchVideo(videoId) {
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoLoadError, setVideoLoadError] = useState(false); // <-- new state

  const fetchVideo = async () => {
    try {
      if (!videoId) {
        console.error('Please provide videoId');
        setLoading(false);
        return;
      }

      const res = await axiosInstance.get(`/videos/watch-video/${videoId}`); // <-- safer endpoint
      setVideoData(res.data.data);
    } catch (error) {
      console.error('Failed to fetch video metadata:', error);
      setVideoData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!videoId) return;
    fetchVideo();
  }, [videoId]);

  return { videoData, loading, videoLoadError, setVideoLoadError };
}

export default useFetchVideo;
