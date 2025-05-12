// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 60000, // 60s timeout
  withCredentials: true, // if using cookies or sessions
});

export default axiosInstance;
