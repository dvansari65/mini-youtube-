import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Video, Heart, PlaySquare, ChevronDown } from 'lucide-react';
import getUser from '../hooks/UserHooks/getUser';

function ProfilePicture() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { userInfo } = getUser();
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    {
      icon: <User className="w-4 h-4" />,
      label: 'Your Channel',
      onClick: () => navigate('/my-profile')
    },
    {
      icon: <Video className="w-4 h-4" />,
      label: 'My Videos',
      onClick: () => navigate('/my-videos')
    },
    {
      icon: <Heart className="w-4 h-4" />,
      label: 'Liked Videos',
      onClick: () => navigate('/liked-videos')
    },
    {
      icon: <PlaySquare className="w-4 h-4" />,
      label: 'Playlists',
      onClick: () => navigate('/playlists')
    },
    {
      icon: <Settings className="w-4 h-4" />,
      label: 'Settings',
      onClick: () => navigate('/settings')
    },
    {
      icon: <LogOut className="w-4 h-4" />,
      label: 'Sign Out',
      onClick: () => {
        // Add your sign out logic here
        navigate('/login');
      }
    }
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full p-1 transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
          {userInfo.avatar ? (
            <img
              src={userInfo.avatar}
              alt={userInfo.userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 transform origin-top-left">
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{userInfo.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userInfo.email}</p>
          </div>
          
          <div className="py-1">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePicture;