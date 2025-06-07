import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useFetchVideo from '../hooks/fetchVideo';
import useFetchLikes from '../hooks/fetchLikes';
import useChannelStatus from '../hooks/subscribeStatus';
import useComment from '../hooks/fetchComment';
import { ThumbsUp, Send } from 'lucide-react';
import axiosInstance from '../services/api';
import { useUser } from '../context/authcontext';

function WatchVideo() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { videoId } = useParams();

  const [currentUser, setCurrentUser] = useState(null);
  const [commentInput, setCommentInput] = useState('');

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

  if (videoLoading || subLoading) return <div className="p-8">Loading...</div>;
  if (!videoData) return <div className="p-8 text-red-500">Video not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {/* Video Player */}
      <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
        <video
          src={videoData.videoFile}
          controls
          autoPlay
          className="w-full h-full"
        />
      </div>

      {/* Video Details */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{videoData.title}</h1>
        <p className="text-gray-600">{videoData.description}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4">
            <img
              src={videoData.avatar}
              alt="channel avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{videoData.owner?.userName}</p>
              <p className="text-sm text-gray-500">{numberOfSubscriber} Subscribers</p>
            </div>
            <button
              onClick={toggleSubscribe}
              className={`ml-4 px-4 py-1 rounded-full font-semibold ${
                isSubscribed ? 'bg-gray-200 text-black' : 'bg-red-500 text-white'
              }`}
            >
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          </div>

          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
              isLike ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
            }`}
          >
            <ThumbsUp size={18} />
            {likesCount}
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-3">{commentsCount} Comments</h2>

        <form onSubmit={handlePostComment} className="flex items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-grow border border-gray-300 rounded px-3 py-2 outline-none"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
          >
            <Send size={16} />
          </button>
        </form>

        <div className="space-y-4">
          {comments?.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="flex gap-3 items-start">
                <img
                  src={comment?.owner?.avatar || currentUser?.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-semibold">{comment?.owner?.userName || currentUser?.userName}</p>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No comments yet. Be the first!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WatchVideo;
