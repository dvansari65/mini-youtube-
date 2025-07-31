// src/context/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../services/api';


// Create the context
const UserContext = createContext();

// Custom hook to access the user context


// UserContext provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store user info
  const [loading, setLoading] = useState(true); // To handle loading state (e.g., while fetching user info)
  const [error, setError] = useState(null); // To handle error state (e.g., failed login)
  
  // Check if user is already logged in (e.g., check localStorage)
  useEffect(() => {
    const authToken = localStorage.getItem("token")
    const storedUserRaw = localStorage.getItem("user")
    if(storedUserRaw && storedUserRaw !== "undefined" || authToken){
        try {
          const storedUser = JSON.parse(storedUserRaw)
          setUser(storedUser)
        } catch (error) {
          console.error("Error parsing stored user:",error)
          localStorage.removeItem("user")
          localStorage.removeItem("token")
          setError(error.data?.message || "failed to fetch user")
        }finally{
          setLoading(false)
        }
    }
    setLoading(false);
  }, []);

  
  const login = async (userName, password) => {
    try {
      const response = await axiosInstance.post('/users/login', { userName, password });
      const loggedInUser = response.data.data.loggedInUser;
      // console.log("Login response:", response.data);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      localStorage.setItem('token', response.data.data.accessToken);
      setUser(loggedInUser);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      return false;
    }finally{
      setLoading(false)
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user'); // Remove user info from localStorage
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser(null)
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  return useContext(UserContext);
};