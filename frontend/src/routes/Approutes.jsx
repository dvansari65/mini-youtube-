import React from 'react'

import { Routes,Route, Navigate } from 'react-router-dom'
import Layout from '../utils/Layout'
import UploadVideo from '../pages/UploadVideo'
import Home from "../pages/Home"
import Login from "../pages/Login"
import WatchVideo from '../pages/watchVideo'
import Register from '../pages/register'
import MyProfile from '../pages/myProfile'
import { useUser } from '../context/authcontext'
import LikedVideos from '../pages/LikedVideos'
import SearchResult from '../pages/SearchResult'
import MyVideos from '../pages/MyVideos'

import { useState } from 'react'
import PlaylistEditModal from '../components/ModalPlaylist'
import SinglePlaylist from '../pages/SinglePlaylist'
import PlayList from '../pages/AllPlaylist'

function Approutes() {
  const {user} = useUser()
  return (
    <Routes>
      <Route element={<Layout/>}>
      <Route path='/' element={user? <Home/> : <Navigate to={"/login"}/>} />
      <Route path='/upload-content' element={user? <UploadVideo/> : <Navigate to={"/login"}/>} />
      <Route path='/watch-video/:videoId' element={user? <WatchVideo/> : <Navigate to={"/login"}/>} />
      <Route path='/my-profile' element={user? <MyProfile/> : <Navigate to={"/login"}/>} />
      <Route path='/liked-videos' element={user? <LikedVideos/> : <Navigate to={"/login"}/>} />
      <Route path='/search-result' element={user? <SearchResult/> : <Navigate to={"/login"}/>} />
      <Route path='/liked' element={user? <LikedVideos/> : <Navigate to={"/login"}/>} />
      <Route path='/my-videos' element={user? <MyVideos/> : <Navigate to={"/login"}/>} />
      <Route path='/playlists' element={user? <PlayList/> : <Navigate to={"/login"}/>} />
      <Route path='/PlaylistEditModal' element={user? <PlaylistEditModal/> : <Navigate to={"/login"}/>} />
      <Route path='/SinglePlaylist/:playlistId' element={user? <SinglePlaylist/> : <Navigate to={"/login"}/>} />
      </Route>
      <Route path='/register' element={ <Register/> } />
      <Route path='/login' element={ <Login/>} />
    </Routes>
  )
}

export default Approutes