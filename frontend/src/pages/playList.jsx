import React, { useState, useEffect } from 'react';
import { ListMusic, Plus, X, Play, Trash2, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGetPlayLists from '../hooks/PlayListHooks/getPlayLists';
import useDeletePlayList from '../hooks/PlayListHooks/deletePlayList';
import useUpdatePlaylist from '../hooks/PlayListHooks/updatePlaylist';
import useAddVideos from '../hooks/PlayListHooks/useAddVideos';
import useCreatePlaylist from '../hooks/PlayListHooks/useCreatePlaylist';

function Playlist() {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { playList, formData, setFormData, setplayList, createPlayList } = useCreatePlaylist();
  const { allPlaylist, setError, error, loading, message, obtainAllPlaylist } = useGetPlayLists();

  useEffect(() => {
    obtainAllPlaylist();
  }, []);

  const playlistId = allPlaylist.map((playList) => playList?._id);

  const {
    deletedPlayList,
    setDeletedPlayList,
    DeletePlayList,
  } = useDeletePlayList(playlistId);

  const {
    updatedPlaylist,
    setUpdatedPlaylist,
    UpdatePlaylist,
    loading: updateLoading,
    error: updateError,
    message: updateMessage,
  } = useUpdatePlaylist(selectedPlaylist?._id);

  useEffect(() => {
    if (selectedPlaylist) {
      setUpdatedPlaylist({
        title: selectedPlaylist.title,
        description: selectedPlaylist.description,
      });
    }
  }, [selectedPlaylist]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await UpdatePlaylist();
    if (!updateError) setIsEditModalOpen(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await createPlayList();
    if (!error) setIsCreateModalOpen(false);
  };

  const { addVideosToThePlaylist, video } = useAddVideos(playlistId);

  const openEditModal = (playlist) => {
    setSelectedPlaylist(playlist);
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading playlists...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPlaylist.map((playlist) => (
              <div
                key={playlist._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <ListMusic className="text-blue-600" size={24} />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{playlist.title}</h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openEditModal(playlist)} className="p-2 text-gray-500 hover:text-blue-600">
                        <Edit2 size={20} />
                      </button>
                      <button onClick={() => DeletePlayList(playlist._id)} className="p-2 text-gray-500 hover:text-red-600">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{playlist.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>{playlist.videos?.length || 0} videos</span>
                    <button onClick={() => navigate(`/playlist/${playlist._id}`)} className="flex items-center space-x-1 text-blue-600 hover:text-blue-700">
                      <Play size={16} />
                      <span>View Playlist</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50" onClick={() => setIsCreateModalOpen(false)}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Playlist</h2>
                  <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleCreate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Playlist Name</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      rows="3"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Create Playlist</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {isEditModalOpen && selectedPlaylist && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/50" onClick={() => setIsEditModalOpen(false)}></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Playlist</h2>
                  <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                    <X className="h-6 w-6 text-gray-500" />
                  </button>
                </div>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Playlist Name</label>
                    <input
                      type="text"
                      value={updatedPlaylist.title}
                      onChange={(e) => setUpdatedPlaylist((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                      value={updatedPlaylist.description}
                      onChange={(e) => setUpdatedPlaylist((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                      rows="3"
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                      {updateLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                  {updateError && <p className="text-red-500 text-sm mt-2">{updateError}</p>}
                  {updateMessage && <p className="text-green-500 text-sm mt-2">{updateMessage}</p>}
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