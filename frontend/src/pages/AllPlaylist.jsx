import React, { useEffect, useState } from 'react'
import useGetPlayLists from '../hooks/PlayListHooks/getPlayLists'
import useCreatePlaylist from '../hooks/PlayListHooks/useCreatePlaylist'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'


function PlayList() {
  const navigate = useNavigate()
  const { allPlaylist, error: allPlaylistError, loading: allPlayListLoading, message, obtainAllPlaylist } = useGetPlayLists()
  const { createPlayList } = useCreatePlaylist()
  const [showCreateModal, setShowCreateModal] = useState(false)
 
  const [newPlaylist, setNewPlaylist] = useState({
    title: '',
    description: ''
  })

  // Default thumbnail component
  const DefaultThumbnail = ({ title }) => (
    <div className="relative pb-[56.25%] bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="mt-2 text-white font-medium text-sm">{title}</p>
        </div>
      </div>
    </div>
  )

  useEffect(() => {
    obtainAllPlaylist()
  }, [])

  if (allPlayListLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (allPlaylistError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{allPlaylistError}</span>
        </div>
      </div>
    )
  }

  const handleCreatePlaylist = () => {
    setShowCreateModal(true)
  }
  

  const handleNavigate = (playlistId) => {
    navigate(`/SinglePlaylist/${playlistId}`)
  }

  const handleCreateNewPlaylist = async () => {
    if (!newPlaylist.title.trim()) {
      alert('Please enter a playlist title')
      return
    }

    try {
      await createPlayList(newPlaylist)
      setShowCreateModal(false)
      setNewPlaylist({ title: '', description: '' })
      obtainAllPlaylist()
    } catch (error) {
      console.error('Failed to create playlist:', error)
    }
  }

  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Your Playlists</h1>
          <button 
            onClick={handleCreatePlaylist}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
          >
            Create Playlist
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {allPlaylist.map(playlist => (
            <div 
              onClick={()=>handleNavigate(playlist._id)}
              key={playlist._id}
              className="bg-gray-800 h-48 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-200 w-full"
            >
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Left side - Playlist preview */}
                  <div className="w-1/4">
                    {playlist.videos.length > 0 ? (
                      <div className="relative pb-[56.25%] rounded-lg overflow-hidden">
                        {playlist.videos[0].thumbnail ? (
                          <img 
                            src={playlist.videos[0].thumbnail} 
                            alt={playlist.title}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <DefaultThumbnail title={playlist.title} />
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                          <div className="bg-black bg-opacity-75 text-white px-2 py-0.5 rounded-full flex items-center gap-1 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Play All</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative pb-[56.25%] rounded-lg overflow-hidden">
                        <DefaultThumbnail title={playlist.title} />
                      </div>
                    )}
                  </div>

                  {/* Right side - Playlist information */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{playlist.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{playlist.description}</p>
                      </div>
                      <button 
                        onClick={() => handlePlaylistClick(playlist._id)}
                        className="text-blue-500 hover:text-blue-400 flex items-center gap-1 text-sm"
                      >
                        <span>View All</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{playlist.videos.length} videos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Created {formatDistanceToNow(new Date(playlist.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>

                    {/* Video previews */}
                    {playlist.videos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {playlist.videos.slice(0, 2).map((video, index) => (
                          <div key={video._id} className="flex gap-2">
                            <div className="w-20 h-12 relative rounded overflow-hidden flex-shrink-0">
                              {video.thumbnail ? (
                                <img 
                                  src={video.thumbnail} 
                                  alt={video.title}
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                              ) : (
                                <DefaultThumbnail title={video.title} />
                              )}
                              <div className="absolute bottom-0.5 right-0.5 bg-black bg-opacity-75 text-white px-1 py-0.5 rounded text-[10px]">
                                {video.duration}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-xs line-clamp-2">{video.title}</h4>
                              <p className="text-gray-400 text-[10px] mt-0.5">{video.views} views</p>
                            </div>
                          </div>
                        ))}
                        {playlist.videos.length > 2 && (
                          <div 
                            onClick={() => handlePlaylistClick(playlist._id)}
                            className="flex items-center justify-center bg-gray-700 rounded-lg cursor-pointer"
                          >
                            <div className="text-center p-1.5">
                              <p className="text-white text-xs">+{playlist.videos.length - 2} more</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-2 bg-gray-700 rounded-lg">
                        <p className="text-gray-400 text-sm">No videos in this playlist yet</p>
                        
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold text-white mb-4">Create New Playlist</h2>
              <input
                type="text"
                placeholder="Playlist Title"
                className="w-full p-2 mb-4 rounded bg-gray-700 text-white border border-gray-600"
                value={newPlaylist.title}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, title: e.target.value })}
              />
              <textarea
                placeholder="Playlist Description"
                className="w-full p-2 mb-4 rounded bg-gray-700 text-white border border-gray-600"
                value={newPlaylist.description}
                onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNewPlaylist}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PlayList