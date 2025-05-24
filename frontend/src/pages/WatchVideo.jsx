import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/api';
import { HeartIcon, EyeIcon, CalendarIcon, ThumbsUpIcon, Share2, Flag } from 'lucide-react';
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

  if (loading) return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (!videoData) return (
    <div className="flex justify-center items-center h-full">
      <p className="text-red-500 text-xl">Video not found.</p>
    </div>
  );

  return (
    <div className="h-full w-full bg-gray-100 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4">
        {/* Video Player Section */}
        <div className="mb-4">
          <div className="aspect-video w-full bg-black overflow-hidden">
            <video
              controls
              poster={videoData.thumbNail}
              className="w-full h-full object-contain"
            >
              <source src={videoData.videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Video Info Section */}
        <div className="space-y-4">
          {/* Title */}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{videoData.title}</h1>

          {/* Stats and Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <span className="font-medium">{videoData.views?.length || 0}</span>
                <span>views</span>
              </div>
              <div className="flex items-center gap-1">
                <span>{new Date(videoData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleLike(videoId)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  videoData.liked 
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <ThumbsUpIcon size={20} />
                <span>{videoData.likes}</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <Share2 size={20} />
                <span>Share</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                <Flag size={20} />
                <span>Report</span>
              </button>
            </div>
          </div>

          {/* Channel Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <img
                src={videoData.avatar}
                alt="avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{videoData.owner.userName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subscription?.data?.subscriberCount || 0} subscribers
                </p>
              </div>
            </div>

            <button
              onClick={() => toggleSubscription(videoData.owner._id)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                subscription?.data?.subscribed
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {subscription?.data?.subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* Description */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {videoData.views?.length || 0} views • {new Date(videoData.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">{videoData.description}</p>
          </div>

          {/* Comments Section */}
          <VideoComments videoId={videoId} token={localStorage.getItem('token')} />
        </div>
      </div>
    </div>
  );
}

export default WatchVideo;
