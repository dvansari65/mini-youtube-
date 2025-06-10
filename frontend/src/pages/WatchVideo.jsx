import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetchVideo from '../hooks/videoHooks/fetchVideo';
import useFetchLikes from '../hooks/LikesHooks/fetchLikes';
import useChannelStatus from '../hooks/subscribeStatus';
import useComment from '../hooks/CommentHooks/fetchComment';
import { ThumbsUp, Send, AlertCircle } from 'lucide-react';
import axiosInstance from '../services/api';
import { useUser } from '../context/authcontext';

function WatchVideo() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { videoId } = useParams();

  const [currentUser, setCurrentUser] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [videoError, setVideoError] = useState(null);

  // Fetch Video
  const { videoData, loading: videoLoading } = useFetchVideo(videoId);

  // Likes
  const { likesCount, isLike, toggleLike } = useFetchLikes(videoId);

  // Comments
  const { comments, commentsCount, postComment } = useComment(videoId);

  // Subscription
  const {
    isSubscribed,
    numberOfSubscriber,
    toggleSubscribe,
    loading: subLoading,
  } = useChannelStatus(videoData?.owner?._id);

  // Get current user
  const fetchCurrentUser = async () => {
    if (!user) return navigate('/login');
    try {
      const res = await axiosInstance.get('/users/get-current-user');
      setCurrentUser(res.data.data.newUser);
    } catch (error) {
      console.error('Failed to fetch current user', error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [user]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    await postComment(commentInput);
    setCommentInput('');
  };

  const handleVideoError = (error) => {
    console.error('Video playback error:', error);
    setVideoError('Unable to play video. Please try again later.');
  };

  if (videoLoading || subLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!videoData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-red-500 text-xl mb-4">Video not found</p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative">
        {videoError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-lg mb-4">{videoError}</p>
            <button
              onClick={() => setVideoError(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <video
            src={videoData.videoFile}
            controls
            autoPlay
            className="w-full h-full"
            onError={handleVideoError}
          />
        )}
      </div>

      {/* Video Details */}
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{videoData.title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{videoData.description}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4">
            <img
              src={videoData.avatar}
              alt="channel avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{videoData.owner?.userName}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{numberOfSubscriber} Subscribers</p>
            </div>
            <button
              onClick={toggleSubscribe}
              className={`ml-4 px-4 py-1 rounded-full font-semibold transition-colors ${
                isSubscribed 
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' 
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors ${
              isLike 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            <ThumbsUp size={18} />
            {likesCount}
          </button>
        </div>

        {/* Video Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 border-t border-b border-gray-200 dark:border-gray-700 py-3">
          <span>{videoData.views} views</span>
          <span>{new Date(videoData.createdAt).toLocaleDateString()}</span>
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Comments ({commentsCount})
          </h2>

          {/* Comment Input */}
          <form onSubmit={handlePostComment} className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send size={20} />
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
              >
                <img
                  src={comment.owner?.avatar || 'default-avatar.png'}
                  alt={comment.owner?.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {comment.owner?.userName}
                    </p>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchVideo;
