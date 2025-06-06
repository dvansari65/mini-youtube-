import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/api';
import { ThumbsUpIcon, Share2, Flag, Bell } from 'lucide-react';
import VideoComments from './VideoComent';
import useChannelStatus from '../hooks/subscribeStatus';

function WatchVideo() {
  const { videoId } = useParams();

  // Video data state
  const [videoData, setVideoData] = useState(null);
  // Likes count state
  const [likesCount, setLikesCount] = useState(0);
  // Loading & error states for video fetch
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [videoError, setVideoError] = useState('');

  // Fetch video info from backend
  const fetchVideo = useCallback(async () => {
    setLoadingVideo(true);
    setVideoError('');
    try {
      const res = await axiosInstance.get(`/videos/get-video/${videoId}`);
      const data = res?.data?.data;
      if (!data) throw new Error('No video data found');
      setVideoData(data);
      setLikesCount(data.likesCount || 0);
    } catch (err) {
      setVideoError('Video not found or error fetching video.');
      console.error(err);
    } finally {
      setLoadingVideo(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchVideo();
  }, [fetchVideo]);

  // Get channel ID safely (only when videoData is loaded)
  const channelId = videoData?.owner?._id;

// Prevent hook from being called with undefined
const shouldInitSubscription = Boolean(channelId);
const {
  isSubscribed,
  numberOfSubscriber,
  error: subscribeError,
  loading: subscribeLoading,
  toggleSubscribe,
} = useChannelStatus(shouldInitSubscription ? channelId : null);

  // Handle subscription toggle with proper error handling
  const handleSubscribe = async () => {
    if (!channelId) {
      console.error('Channel ID is missing');
      return;
    }
    try {
      await toggleSubscribe();
    } catch (error) {
      console.error('Error toggling subscription:', error);
    }
  };

  // Like toggle handler
  const toggleLike = async () => {
    if (!videoId) return;
    try {
      const res = await axiosInstance.post(`/likes/toggle-video-like/${videoId}`);
      const { isLiked, likesCount: updatedLikesCount } = res?.data?.data || {};
      setVideoData(prev => ({
        ...prev,
        liked: isLiked,
      }));
      setLikesCount(updatedLikesCount ?? likesCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };
  useEffect(() => {
    console.log("videoData:", videoData);
    console.log("channelId:", channelId);
  }, [videoData]);
  

  // Loading state for the entire page
  if (loadingVideo || subscribeLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Video not found or error
  if (videoError || !videoData) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500 text-xl">{videoError || 'Video not found.'}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-100 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4">
        {subscribeError && (
          <div className="mb-4 px-4 py-2 bg-red-100 text-red-700 rounded-md">
            ⚠️ {subscribeError}
          </div>
        )}

        {/* Video Player Section */}
        <div className="mb-4">
          <div className="aspect-video w-full bg-black overflow-hidden rounded-xl shadow-lg">
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{videoData.title}</h1>

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
                onClick={toggleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                  videoData.liked
                    ? 'bg-gray-200 dark:bg-gray-700 text-red-500 dark:text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <ThumbsUpIcon size={20} />
                <span>{likesCount}</span>
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
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{videoData.owner.userName}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {numberOfSubscriber} subscribers
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={()=>handleSubscribe()}
                className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-colors ${
                   isSubscribed
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isSubscribed ? (
                  <>
                    <Bell size={18} />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {(videoData.views?.length || 0)} views • {new Date(videoData.createdAt).toLocaleDateString()}
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
