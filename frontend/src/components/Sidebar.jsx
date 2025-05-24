import React from 'react';
import { HeartIcon, UserPlusIcon, SettingsIcon, UploadIcon, VideoIcon, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/authcontext';

const Sidebar = () => {
  const location = useLocation();
  const {user} = useUser()
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col border-r border-gray-700">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-blue-400">Menu</h2>
          </div>
          
          <SidebarItem 
            icon={<Home size={20} />} 
            label="Home" 
            to="/" 
            isActive={isActive('/')}
          />
          <SidebarItem 
            icon={<UserPlusIcon size={20} />} 
            label="myProfile" 
            to='/my-profile'
            isActive={isActive('/my-profile')}
          />
          <SidebarItem 
            icon={<HeartIcon size={20} />} 
            label="Liked Videos" 
            to="/liked" 
            isActive={isActive('/liked')}
          />
          <SidebarItem 
            icon={<UploadIcon size={20} />} 
            label="Upload Video" 
            to="/upload-content" 
            isActive={isActive('/upload-content')}
          />
          <SidebarItem 
            icon={<VideoIcon size={20} />} 
            label="My Videos" 
            to="/my-videos" 
            isActive={isActive('/my-videos')}
          />
          <SidebarItem 
            icon={<SettingsIcon size={20} />} 
            label="Settings" 
            to="/settings" 
            isActive={isActive('/settings')}
          />
        </div>
      </div>
    </aside>
  );
};

const SidebarItem = ({ icon, label, to, isActive }) => (
  <Link
    to={to}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <div className={`${isActive ? 'text-white' : 'text-gray-400'}`}>
      {icon}
    </div>
    <span className="font-medium">{label}</span>
  </Link>
);

export default Sidebar;
