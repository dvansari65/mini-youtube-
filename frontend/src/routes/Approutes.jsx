import React from 'react'
import Layout from '../utils/Layout'
import { Routes,Route } from 'react-router-dom'
import ProtectedRoute from "../components/ProtectedRoute"
import UploadVideo from '../pages/uploadVideo'
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
function Approutes() {
  return (
    <Routes>
        <Route element={<ProtectedRoute><Layout/></ProtectedRoute>}>
        <Route path="/" element={<Home/>}/>
        <Route path="/upload-content" element={<UploadVideo/>}/>
        </Route>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
    </Routes>
  )
}

export default Approutes