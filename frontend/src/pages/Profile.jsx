import React, { useState } from 'react';
import { UserCircle, Users, Heart, Video, ChevronRight, Edit2, Settings } from 'lucide-react';
import EditProfileModal from '../components/EditProfileModal';

function Profile() {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
   const [form,setForm] = useState({
    userName,
    email,
    fullName,
    coverImage:null,
    avatar:null,
   })

    const handleSaveProfile = (newImages) => {
        setProfileData(prev => ({
            ...prev,
            ...newImages
        }));
    };

    return (
        <div className="h-full overflow-y-auto bg-gray-100 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
                    <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
                        {profileData.coverImage && (
                            <img
                                src={URL.createObjectURL(profileData.coverImage)}
                                alt="Cover"
                                className="w-full h-full object-cover"
                            />
                        )}
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
                                    {profileData.avatarImage ? (
                                        <img
                                            src={URL.createObjectURL(profileData.avatarImage)}
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
                                    {profileData.username}
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {profileData.handle}
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
                                    {profileData.subscribers}
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
                                    {profileData.totalLikes}
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
                                    {profileData.totalVideos}
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
                        {/* Sample Channel Item */}
                        <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700">
                                        <UserCircle className="h-full w-full text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Channel Name
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            0 subscribers
                                        </p>
                                    </div>
                                </div>
                                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Videos */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Recent Videos
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {/* Sample Video Card */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg overflow-hidden">
                            <div className="aspect-video bg-gray-200 dark:bg-gray-600">
                                {/* Video Thumbnail */}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    Video Title
                                </h3>
                                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                    <span>0 views</span>
                                    <span>0 likes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSaveProfile}
            />
        </div>
    );
}

export default Profile; 