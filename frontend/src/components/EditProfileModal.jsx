import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, onSave }) => {
    const [coverImage, setCoverImage] = useState(null);
    const [avatarImage, setAvatarImage] = useState(null);
    const [previewCover, setPreviewCover] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(null);

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setPreviewCover(URL.createObjectURL(file));
        }
    };

    const handleAvatarImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarImage(file);
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    const handleSave = () => {
        onSave({ coverImage, avatarImage });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
                
                <div className="relative w-full max-w-2xl rounded-xl bg-white dark:bg-gray-800 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Edit Profile Images
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">
                        {/* Cover Image Upload */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Cover Image
                            </h3>
                            <div className="relative h-48 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                                {previewCover ? (
                                    <div className="relative h-full w-full">
                                        <img
                                            src={previewCover}
                                            alt="Cover preview"
                                            className="h-full w-full object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={() => {
                                                setCoverImage(null);
                                                setPreviewCover(null);
                                            }}
                                            className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="flex h-full cursor-pointer items-center justify-center">
                                        <div className="text-center">
                                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                            <span className="mt-2 block text-sm font-medium text-gray-600 dark:text-gray-400">
                                                Click to upload cover image
                                            </span>
                                            <span className="mt-1 block text-xs text-gray-500 dark:text-gray-500">
                                                PNG, JPG, GIF up to 10MB
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleCoverImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Avatar Upload */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Profile Picture
                            </h3>
                            <div className="flex items-center space-x-6">
                                <div className="relative h-32 w-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors overflow-hidden">
                                    {previewAvatar ? (
                                        <div className="relative h-full w-full">
                                            <img
                                                src={previewAvatar}
                                                alt="Avatar preview"
                                                className="h-full w-full object-cover"
                                            />
                                            <button
                                                onClick={() => {
                                                    setAvatarImage(null);
                                                    setPreviewAvatar(null);
                                                }}
                                                className="absolute top-1 right-1 p-1 rounded-full bg-black/50 text-white hover:bg-black/70"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex h-full cursor-pointer items-center justify-center">
                                            <div className="text-center">
                                                <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                                                <span className="mt-1 block text-xs text-gray-600 dark:text-gray-400">
                                                    Upload
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleAvatarImageChange}
                                            />
                                        </label>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Upload a profile picture to personalize your channel. We recommend using a square image for best results.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end space-x-4 border-t border-gray-200 dark:border-gray-700 p-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal; 