import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/api';
import { MessageCircleIcon, HeartIcon, UserCircleIcon, AlertCircle } from 'lucide-react';
import useDebounce from '../hooks/useDBounce';

function SearchResult() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const query = searchParams.get('q');
  const LIMIT = 10;
  const observer = useRef();

  const debouncedQuery = useDebounce(query, 500);

  const navigateToWatchVideo = (videoId) => {
    if (loading) return;
    navigate(`/watch-video/${videoId}`);
  };

  useEffect(() => {
    setVideos([]);
    setPage(1);
    setHasMore(true);
    setError('');
    setHasSearched(false);
  }, [debouncedQuery]);

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
    const controller = new AbortController();

    if (!debouncedQuery) return;
    setLoading(true);
    setError('');
    setHasSearched(true);

    const fetchSearchResults = async () => {
      try {
        const res = await axiosInstance.get(
          `/videos/search-videos?q=${encodeURIComponent(debouncedQuery.trim())}&page=${page}&limit=${LIMIT}`,
          { signal: controller.signal }
        );

        const newVideos = res.data?.data?.videos || [];
        
        if (newVideos.length === 0) {
          setHasMore(false);
          if (page === 1) {
            setVideos([]);
          }
          return;
        }

        setVideos((prev) => {
          const existingIds = new Set(prev.map((v) => v._id));
          const filteredIds = newVideos.filter((v) => !existingIds.has(v._id));
          return [...prev, ...filteredIds];
        });
        setHasMore(newVideos.length === LIMIT);
      
      } catch (error) {
        if (error.name === 'AbortError') return;
        
        // Handle network errors or server errors
        if (error.response?.status === 404) {
          setVideos([]);
          setHasMore(false);
          return;
        }
        
        console.error('Error fetching search results:', error);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
    return () => controller.abort();
  }, [debouncedQuery, page]);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => {
              setError('');
              setPage(1);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-600 dark:text-gray-400 text-xl">Enter a search term to find videos.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Search Results for "{query}"
      </h1>

      {hasSearched && videos.length === 0 && !loading ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No videos found matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.map((video, index) => {
            const isLast = index === videos.length - 1;
            return (
              <div
                key={video._id}
                ref={isLast ? lastVideoRef : null}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigateToWatchVideo(video._id)}
              >
                <div className="aspect-video bg-black relative">
                  {video.thumbNail ? (
                    <img
                      src={video.thumbNail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <AlertCircle className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <img
                        src={video.owner?.avatar || 'default-avatar.png'}
                        alt={video.owner?.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {video.owner?.userName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <div className="flex items-center gap-1">
                          <HeartIcon size={16} />
                          <span>{video?.likes?.length || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircleIcon size={16} />
                          <span>{video?.views || 0}</span>
                        </div>
                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
}

export default SearchResult;