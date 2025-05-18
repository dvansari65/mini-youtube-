import React, { useState } from 'react';
import {  NavLink } from 'react-router-dom';
import { useUser } from '../context/authcontext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const {logout} = useUser()
  const navigate = useNavigate()
  const[showLogoutModel,setShowLogoutModel] = useState(false)
  const handleLogoutClick  = (e)=>{
      e.preventDefault();
      setShowLogoutModel(true)
  }
  const confirmLogout = ()=>{
      logout();
      navigate("/login")
  }
  const cancelLogout=()=>{
    setShowLogoutModel(false)
  }


  return (
    <header className="sticky top-0 left-0 right-0 h-1/18  z-50 flex justify-between items-center p-4  bg-blue-400 shadow ">


      <div className="text-white">
        <h1 className="text-2xl font-bold">youTube</h1>
      </div>
      <nav>
        <ul className="flex space-x-6">
        <li>
            <NavLink to="/" className={({isActive})=>isActive ? "text-white text-lg font-semibold hover:text-white" : "text-gray-300 text-lg font-semibold hover:text-white"}
            
            >Home</NavLink>
          </li>
          {showLogoutModel && (
           <div className="fixed inset-0 flex justify-center items-center z-50 pointer-events-auto">

             <div className="bg-white p-6 rounded-lg shadow-lg text-center space-y-4">
               <h2 className="text-xl font-bold">Confirm Logout</h2>
               <p>Are you sure you want to log out?</p>
               <div className="flex justify-center gap-4">
                 <button
                   onClick={confirmLogout}
                   className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                 >
                   Logout
                 </button>
                 <button
                  onClick={cancelLogout}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                 >
                   Cancel
                 </button>
               </div>
             </div>
           </div>
          )}

          <li>
          <button
          onClick={handleLogoutClick}
          className="text-gray-300 text-lg font-semibold hover:text-gray-100"
          >
          Logout
          </button>

          </li>
          <li>
            <NavLink to="/register" className={({isActive})=>isActive ? "text-white text-lg font-semibold hover:text-gray-300" : "text-gray-300 text-lg font-semibold hover:text-gray-100"}
            
            >Register</NavLink>
         </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
