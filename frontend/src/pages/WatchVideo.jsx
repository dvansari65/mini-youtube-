import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../services/api'
import { HeartIcon } from 'lucide-react'
import axios from 'axios'

function WatchVideo() {
 
  const {videoId} = useParams()
  const [videoData,setVideoData] = useState(null)
  const [loading,setLoading] = useState(true)
  const [subscription,setSubscription] = useState()
  const toggleSubscription = async()=>{
    const res = axiosInstance.post(`/subscription/toggle-subscription?channelId=${videoData.owner._id}`)

  }
  const toggleLike = async (videoId)=>{
   
      try {
        const res = await axiosInstance.post(`/likes/toggle-video-like/${videoId}`)
        const updatedLikes  = res.data.data.updatedVideoLikes
        console.log("res.data.data.updatedVideoLikes",res.data.data.updatedVideoLikes)
        console.log("videoData._id",videoId)
        setVideoData(prev=>(
         {
           ...prev,
           likes:updatedLikes,
           liked:res.data.data.liked
         }
       ))
     } catch (error) {
      console.error("Error liking video:", error);
     }
   }
  const fetchVideo = async ()=>{
    try {
      const res = await axiosInstance.get(`/videos/watch-video/${videoId}`)
      console.log("res:",res)
      if(!res){
        console.log("video not found")
      }
      console.log("Full response data:", res.data);
      console.log("Inner video owner:", res.data.data);
      setVideoData(res.data.data)
      console.log("VideoData:", videoData)
      console.log("Video URL:", res.data.data.videoFile);
      setLoading(false)
    } catch (error) {
      console.error("something went wrong while fetching the video",error)
      setLoading(false)
    }
  }
  useEffect(()=>{
    fetchVideo()
  },[videoId]);
  useEffect(() => {
    if (videoData) {
      console.log("VideoData:", videoData); // ✅ This should NOT be undefined
    }
  }, [videoData]);

  
  if(loading) return <p className="text-center p-8">Loading video...</p>;
  if(!videoData) return <p className="text-center text-red-500">Video not found.</p>;
  return (
    <div className='w-7/8 h-full mt-25 bg-black rounded-2xl'>
      <div className="p-6 w-7/8 flex items-center flex-col justify-center ">
    <h1 className="text-2xl font-bold mb-2">{videoData.title}</h1>
   
    
    <video
      controls
      poster={videoData.thumbNail}
      className="ml-28 w-full rounded-lg mb-4"
    >
      <source src={videoData.videoFile} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div className='flex justify-between items-center mb-2 w-full ml-28 bg-gray-200 rounded-3xl p-2'>
       <div className='flex items-center gap-3'>
       <img
        src={videoData.avatar}
  
        className="w-10 h-10 rounded-full object-cover"
        />
        <div className='text-2xl bg-none text-black rounded-2xl p-2'>{videoData.owner.userName}</div>
        
       </div>
       
       <div className='flex items-center p-2  gap-3'>
          <div className='flex gap-8 mr-5 mt-2 font-bold'>
         
            <div className='flex justify-center gap-3'>
            <p className="text-gray-600 mb-4 ">  {videoData.views} views</p>
            <button onClick= {()=>toggleLike(videoId)} className="text-gray-600 flex items-center justify-center m-1  mb-5  mt-1 hover:cursor-auto"> 
              <HeartIcon 
              size={18}
              className={videoData.liked ? "text-blue-500":"text-none"}
               />
             </button>
             <p>{videoData.likes}</p>
            </div>
          </div>
          <button  onClick={toggleSubscription} className=' text-white p-2 rounded-2xl m-2 bg-black'>Subscribe</button>
       </div>
   </div>
   <div className='w-full h-auto flex items-center flex-row bg-gray-200 p-5 ml-28 rounded-2xl'>
  
    <p className="text-gray-700  ">
    
      {videoData.description}</p>
    </div>
  </div>
    </div>
  )
}

export default WatchVideo