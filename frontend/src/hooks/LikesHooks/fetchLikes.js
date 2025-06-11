import React, { useEffect } from 'react'
import axiosInstance from '../../services/api'
import { useState } from 'react'
function useFetchLikes(videoId) {

  const [videoLikesCount,setLikesCount] = useState(null)
  const [isLike,setIsLike] = useState(false)

  
  const fetchLikesCount = async()=>{
    try {
        const res = await axiosInstance.get(`/likes/number-Of-Likes-Of-Videos/${videoId}`)
       
        if(!res){
            console.error("response not obtain from backend",error)
        }
        
        setLikesCount(res.data.data.videoLikes)
    } catch (error) {
        console.error("can not fetched likes",error)
    }
  }

  
const checkLikeStatus = async()=>{
  try {
    const res = await axiosInstance.get(`/likes/check-like-status/${videoId}`)
    if(!res){
      console.log("response not obtain from backen")
      throw error
    }
    setIsLike(res.data.data.isLiked)
  } catch (error) {
    console.log("failed to check like status",error)
    throw error
  }
}


  const toggleLike = async ()=>{
    try {
        const res = await axiosInstance.post(`/likes/toggle-video-like/${videoId}`)
        if(!res){
            console.error("response not obtain from backend",error)
        }
        fetchLikesCount()
        checkLikeStatus()
        
    } catch (error) {
        console.error("like status can not be fetched",error)
    }
  }


  useEffect(()=>{
    if(videoId) {
    fetchLikesCount()
    checkLikeStatus()
    }
  },[videoId])

  return {videoLikesCount,setLikesCount,checkLikeStatus,fetchLikesCount,isLike,toggleLike}
}

export default useFetchLikes