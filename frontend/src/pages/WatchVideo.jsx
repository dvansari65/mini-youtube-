import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/api';
import { HeartIcon } from 'lucide-react';
import VideoComments from './VideoComent';

function WatchVideo() {
  const { videoId } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  const toggleSubscription = async (channelId) => {
    try {
      const res = await axiosInstance.post(`/subscription/toggle-subscription?channelId=${channelId}`);
      setSubscription(res.data);
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  const toggleLike = async (videoId) => {
    try {
      const res = await axiosInstance.post(`/likes/toggle-video-like/${videoId}`);
      const updatedLikes = res.data.data.updatedVideoLikes;
      setVideoData(prev => ({
        ...prev,
        likes: updatedLikes,
        liked: res.data.data.liked
      }));
    } catch (error) {
      console.error("Error liking video:", error);
    }
  };

  const fetchVideo = async () => {
    try {
      const res = await axiosInstance.get(`/videos/watch-video/${videoId}`);
      setVideoData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching video:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  if (loading) return <p className="text-center p-8">Loading video...</p>;
  if (!videoData) return <p className="text-center text-red-500">Video not found.</p>;

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-900 pt-24 mt-80 pb-24 min-h-screen overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{videoData.title}</h1>
          <video
            controls
            poster={videoData.thumbNail}
            className="w-full  rounded-lg shadow-lg"
          >
            <source src={videoData.videoFile} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Channel + Like/Sub */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={videoData.avatar}
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold dark:text-white">{videoData.owner.userName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Subscribers: {subscription?.data?.subscriberCount || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <HeartIcon
                size={20}
                className={`cursor-pointer ${videoData.liked ? "text-blue-500" : "text-gray-500"}`}
                onClick={() => toggleLike(videoId)}
              />
              <p className="text-gray-700 dark:text-gray-300">{videoData.likes}</p>
            </div>
            <button
              onClick={() => toggleSubscription(videoData.owner._id)}
              className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition"
            >
              {subscription?.data?.subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow mb-6">
          <p className="text-gray-800 dark:text-gray-100">{videoData.description}</p>
        </div>

        {/* Comments */}
        <VideoComments videoId={videoId} token={localStorage.getItem('token')} />
      </div>
    </div>
  );
}

export default WatchVideo;
