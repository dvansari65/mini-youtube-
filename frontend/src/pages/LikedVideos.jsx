import React from 'react'
import axiosInstance from '../services/api'

async function LikedVideos () {
    const [error,setError] = useState(false)
    const [loading,setLoading] = useState(true)
    
    try {
        const res = await axiosInstance.get('likes/get-all-liked-videos')
        
    } catch (error) {
        console.error("something went wrong while fetching liked videos",error)
    }
  return (
    <div>LikedVideos</div>
  )
}

export default LikedVideos