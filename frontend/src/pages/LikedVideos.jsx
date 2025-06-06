import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api';
import { Heart, Clock, Eye, UserCircle } from 'lucide-react';

function LikedVideos() {
  const navigate = useNavigate();
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const res = await axiosInstance.get('/likes/total-likes-off-user-channel-videos');
        if (res.data.success) {
          // Fetch video details for each liked video
          const videoPromises = res.data.data.allLikesVideos.map(async (like) => {
            try {
              const videoRes = await axiosInstance.get(`/videos/get-video/${like.video}`);
              return videoRes.data.data;
            } catch (error) {
              console.error('Error fetching video details:', error);
              return null;
            }
          });

          const videos = await Promise.all(videoPromises);
          setLikedVideos(videos.filter(video => video !== null));
        }
      } catch (error) {
        setError('Failed to fetch liked videos');
        console.error('Error fetching liked videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  if (likedVideos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <Heart className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Liked Videos Yet</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Videos you like will appear here</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
        >
          Explore Videos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Liked Videos</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {likedVideos.length} {likedVideos.length === 1 ? 'video' : 'videos'} liked
          </p>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {likedVideos.map((video) => (
            <div
              key={video._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/watch-video/${video._id}`)}
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-black relative">
                <img
                  src={video.thumbNail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                  {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>

              {/* Video Info */}
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <img
                      src={video.owner.avatar}
                      alt={video.owner.userName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {video.owner.userName}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                      <div className="flex items-center gap-1">
                        <Eye size={16} />
                        <span>{video.views?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LikedVideos;