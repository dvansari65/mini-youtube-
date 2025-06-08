import React, { useState } from 'react'
import axiosInstance from '../services/api'

function useFetchMyVideos() {
    const [myVideos,setMyVideos]  = useState([])
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(true)
    const fetchVideos = async()=>{
    const res = await axiosInstance.get('/videos/my-videos')
    if(!res){
        console.log("response not obtain from backend",error)
        throw error
    }
    setMyVideos(res.data.data)
    }
    return {myVideos,fetchVideos,error,setLoading,setError,loading}
}

export default useFetchMyVideos