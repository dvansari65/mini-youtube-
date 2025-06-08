import React, { useEffect, useState } from 'react';
import { UserCircle, Users, Heart, Video, ChevronRight, Edit2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import Profile from './Profile';
import useFetchUser from '../hooks/fetchUser';
import useChannelStatus from '../hooks/subscribeStatus';
import useFetchLikesOfChanel from '../hooks/fetchLikesOfChanel';
import useFetchMyVideos from '../hooks/fetchMyVideos';
import emitter from '../eventEmitter';

function MyProfile() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const {User,fetchUser} = useFetchUser()
    const {numberOfSubscriber,fetchSubscriberCount,fetchSubscribedChannel,subscribedTo} = useChannelStatus(User?._id)
    const {channelLikes,fetchTotalChannelLikes}  = useFetchLikesOfChanel(User?._id)
    const {myVideos,fetchVideos,error,setLoading,setError,loading} = useFetchMyVideos()
    const navigate = useNavigate()
    const handleProfileNavigate = ()=>{
        navigate('/')
    }
    useEffect(() => {
        setError('')
        setLoading(true)
        try {
            const handler = ()=>{
            fetchUser();
            fetchSubscriberCount()
            fetchTotalChannelLikes()
            fetchSubscribedChannel()
            fetchVideos()
            }
            emitter.on('userUpdated', handler)
            return ()=>{
                emitter.off('userUpdated', handler);
            }
            
        } catch (error) {
            console.error("failed to fetch data",error)
            setError("failed to fetch data")
        }finally{
            setLoading(false)
           
        }
        
    }, []);

    if (loading) return <p className='text-gray-600'>loading...</p>;
    if (error) return <p className='text-red-500 text-center py-10'>{error}</p>
    return (
        <div className="h-full overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
                        {User?.coverImage ? (
                            <img 
                                src={User.coverImage} 
                                alt="cover" 
                                className="w-full h-full object-cover"
                            />
                        ) : null}
                        <div className="absolute inset-0 bg-black/20"></div>
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                        >
                            <Edit2 className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="px-6 py-4">
                        <div className="flex items-center -mt-16">
                            <div className="relative">
                                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 overflow-hidden">
                                    {User?.avatarImage ? (
                                        <img
                                            src={User.avatar}
                                            alt="Avatar"
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <UserCircle className="h-full w-full text-gray-400" />
                                    )}
                                </div>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                            </div>
                            <div className="ml-6 mt-16">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {User?.userName}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400">
                                    @{User?.userName?.toLowerCase() || ''}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Subscribers
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {numberOfSubscriber}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50">
                                <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Total Likes
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {channelLikes || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/50">
                                <Video className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Total Videos
                                </p>
                                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {myVideos.length || 0}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscribed Channels */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Subscribed Channels
                        </h2>
                        <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <Settings className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {subscribedTo?.map((channel) => (
                            <div key={channel._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                            {channel.channel.avatar ? (
                                                <img
                                                    src={channel.channel.avatar}
                                                    alt={channel.channel.userName}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <UserCircle className="h-full w-full text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                {channel.channel.userName}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {numberOfSubscriber || 0} subscribers
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleProfileNavigate}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Videos */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            subscribed  channels
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        { subscribedTo.length > 0  ?
                        (subscribedTo.map((video) => (
                            <div key={video._id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden">
                                <div className="aspect-video bg-gray-200 dark:bg-gray-600">
                                    {video.thumbnail && (
                                        <img
                                            src={video.thumbnail}
                                            alt={video.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        {video.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <span>{video.views || 0} views</span>
                                        <span>{video.likes || 0} likes</span>
                                    </div>
                                </div>
                            </div>
                        ))) : <div className='flex justify-center items-center text-white'><p><h2>not watched videos recently</h2></p></div>}
                    </div>
                </div>
            </div>

            {/* Profile Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div className="fixed inset-0 bg-black/50" onClick={() => setIsEditModalOpen(false)}></div>
                        <div className="relative w-full max-w-4xl">
                            <Profile />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyProfile;