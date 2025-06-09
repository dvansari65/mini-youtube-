import React, { useEffect, useState } from 'react'
import axiosInstance from '../../services/api'

function useFetchVideo(videoId) {
    const [videoData,setVideoData] = useState(null)
    const [loading,setLoading] = useState(true)

    const fetchVideo = async()=>{
        try {
            if(!videoId){
                console.error("please provide videoId",error)
                setLoading(false)
                return 
            }
            const res = await axiosInstance.get(`/videos/watch-video/${videoId}`)
            if(!res){
                console.error('res not obtain from backend',error)
                setLoading(false)
            }
            setVideoData(res.data.data)
            setLoading(false)
        }
         catch (error) {
            console.error("video not found",error)
            setLoading(false)
        }
        useEffect(()=>{
            if(!videoId) return;
            fetchVideo();
        },[videoId])
}
return {videoData,loading}
}
export default useFetchVideo