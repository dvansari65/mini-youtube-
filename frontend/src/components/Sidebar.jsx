import React from 'react';
import { HeartIcon, UserPlusIcon, SettingsIcon ,UploadIcon,VideoIcon} from 'lucide-react';
import { Link } from 'react-router-dom';
import UploadVideo from '../pages/uploadVideo';
const Sidebar = () => {
  return (
    <aside className="w-48 h-screen bg-gray-900 text-white p-4 flex flex-col space-y-6">
      <SidebarItem icon={<UserPlusIcon size={20} />} label="Subscriptions" to="/subscriptions" />
      <SidebarItem icon={<HeartIcon size={20} />} label="Liked Videos" to="/liked" />
      <SidebarItem icon={<UploadIcon size={20} />} label="Upload Video" to="/uploadVideo" />
      <SidebarItem icon={<VideoIcon size={20} />} label="my videos" to="/my-videos" />
      <SidebarItem icon={<SettingsIcon size={20} />} label="Settings" to="/settings" />
     
    </aside>
  );
};

const SidebarItem = ({ icon, label, to }) => (
  <Link
    to={to}
    className="flex items-center space-x-3 hover:bg-gray-800 px-3 py-2 rounded-lg transition"
  >
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

export default Sidebar;
