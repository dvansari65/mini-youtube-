import React from 'react'
import Header from "./components/Header"
import Footer from "./components/Footer"
import Sidebar from "./components/Sidebar"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./pages/Register"
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Layout from './utils/Layout'
import UploadVideo from './pages/uploadVideo'
function App() {
  return (
   
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Layout/></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="/uploadVideo" element={<UploadVideo />} />
           </Route>
          <Route path="/register" element={<Register/>}/>
          <Route path="/login" element={<Login/>}/>
          
        </Routes>
      </BrowserRouter>
    
  )
}

export default App