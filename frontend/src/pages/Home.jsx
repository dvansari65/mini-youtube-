import React, { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../services/api';
import { MessageCircleIcon, HeartIcon, UserCircleIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigateToWatchVideo = (videoId) => {
    if (loading) return;
    navigate(`/watch-video/${videoId}`);
  };

  const LIMIT = 9;
  const observer = useRef();

  const lastVideoRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/videos/get-all-video?page=${page}&limit=${LIMIT}`);
        const newVideos = res.data?.data || [];
        if (newVideos.length === 0) {
          setHasMore(false);
          return;
        }

        setVideos((prev) => {
          const existingIds = new Set(prev.map(v=>v._id))
          const filteredIds = newVideos.filter(v => !existingIds.has(v._id))
          return [...prev, ...filteredIds]});
        setHasMore(newVideos.length === LIMIT);
      } catch (error) {
        console.error('Failed to fetch videos from the database', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [page]);

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {videos.map((video, index) => {
          const isLast = index === videos.length - 1;

          return (
            <div
              key={video._id}
              ref={isLast ? lastVideoRef : null}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-black cursor-pointer" onClick={() => navigateToWatchVideo(video._id)}>
                <video
                  src={video?.videoFile}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <UserCircleIcon className="text-gray-600 dark:text-gray-400" />
                  <h2 className="font-semibold text-gray-900 dark:text-white truncate">
                    {video.owner.userName}
                  </h2>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <HeartIcon size={16} />
                    <span>{video?.likes?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircleIcon size={16} />
                    <span>{video?.views?.length || 0}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(video.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}

export default Home;
