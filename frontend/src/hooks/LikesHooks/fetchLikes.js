import React, { useEffect } from 'react'
import axiosInstance from '../../services/api'
import { useState } from 'react'
function useFetchLikes(videoId) {
  const [videoLikesCount,setLikesCount] = useState(null)
  
  const [isLike,setIsLike] = useState(false)

  
  const fetchLikesCount = async()=>{
    try {
        const res = await axiosInstance.post(`/likes/toggle-video-like/${videoId}`)
        if(!res){
            console.error("response not obtain from backend",error)
        }
        setLikesCount(res.data.data.likesCount)
    } catch (error) {
        console.error("can not fetched likes",error)
    }
  }

  const toggleLike = async ()=>{
    try {
        const res = await axiosInstance.post(`/likes/toggle-video-like/${videoId}`)
        if(!res){
            console.error("response not obtain from backend",error)
        }
        setIsLike(res.data.data.isLiked)
        fetchLikesCount()
    } catch (error) {
        console.error("like status can not be fetched",error)
    }
  }
  useEffect(()=>{
    if(!videoId) return;
    fetchLikesCount()
  },[videoId])
  return {videoLikesCount,isLike,toggleLike}
}

export default useFetchLikes