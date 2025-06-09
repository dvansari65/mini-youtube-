import React, { useState, useEffect } from 'react';
import { ListMusic, Plus, X, Play, Trash2, Edit2 } from 'lucide-react';
import axiosInstance from '../services/api';
import { useNavigate } from 'react-router-dom';

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/playlists/user-playlists');
      if (res.data.success) {
        setPlaylists(res.data.data);
      }
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setError('Failed to fetch playlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/playlists/create', formData);
      if (res.data.success) {
        setPlaylists([...playlists, res.data.data]);
        setFormData({ name: '', description: '' });
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      setError('Failed to create playlist');
    }
  };

  const handleEditPlaylist = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.patch(`/playlists/${selectedPlaylist._id}`, formData);
      if (res.data.success) {
        setPlaylists(playlists.map(playlist => 
          playlist._id === selectedPlaylist._id ? res.data.data : playlist
        ));
        setFormData({ name: '', description: '' });
        setIsEditModalOpen(false);
        setSelectedPlaylist(null);
      }
    } catch (error) {
      console.error('Error updating playlist:', error);
      setError('Failed to update playlist');
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      const res = await axiosInstance.delete(`/playlists/${playlistId}`);
      if (res.data.success) {
        setPlaylists(playlists.filter(playlist => playlist._id !== playlistId));
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      setError('Failed to delete playlist');
    }
  };

  const openEditModal = (playlist) => {
    setSelectedPlaylist(playlist);
    setFormData({
      name: playlist.name,
      description: playlist.description
    });
    setIsEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Playlists</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Create Playlist</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Playlists Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <ListMusic className="text-blue-600" size={24} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{playlist.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(playlist)}
                      className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeletePlaylist(playlist._id)}
                      className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{playlist.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>{playlist.videos?.length || 0} videos</span>
                  <button
                    onClick={() => navigate(`/playlist/${playlist._id}`)}
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <Play size={16} />
                    <span>View Playlist</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Playlist Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50" onClick={() => setIsCreateModalOpen(false)}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Playlist</h2>
                  <button
                    onClick={() => setIsCreateModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleCreatePlaylist} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Playlist Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter playlist name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter playlist description"
                      rows="3"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsCreateModalOpen(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Create Playlist
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Playlist Modal */}
        {isEditModalOpen && selectedPlaylist && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50" onClick={() => setIsEditModalOpen(false)}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Playlist</h2>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-200"
                  >
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleEditPlaylist} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Playlist Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter playlist name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter playlist description"
                      rows="3"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Playlist; 