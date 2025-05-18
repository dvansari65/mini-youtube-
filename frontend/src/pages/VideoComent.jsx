import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/api';
import { FaRegHeart } from 'react-icons/fa';

const VideoComments = ({ videoId, token }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await axiosInstance.get(`/comments/get-all-comment?videoId=${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments(res.data.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleAddComment = async () => {
    if (!content.trim()) return;
    try {
      setLoading(true);
      await axiosInstance.post(
        `/comments/add-comment?videoId=${videoId}`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setContent('');
      fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (videoId && token) fetchComments();
  }, [videoId, token]);

  return (
    <div className="w-full mt-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Comments</h2>

      {/* Add Comment */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-grow px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring focus:border-blue-500"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
        />
        <button
          onClick={handleAddComment}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>

      {/* Comment List */}
      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="flex items-start gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-lg shadow-sm"
          >
            <div className="h-10 w-10 bg-gray-300 rounded-full dark:bg-gray-600" />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-700 dark:text-gray-200">
                  {comment.owner?.userName || 'User'}
                </p>
              </div>
              <p className="text-gray-800 dark:text-gray-100">{comment.content}</p>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <button className="flex items-center gap-1 hover:text-red-500 transition">
                  <FaRegHeart />
                </button>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoComments;
