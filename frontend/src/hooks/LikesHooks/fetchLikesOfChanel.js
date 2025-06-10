import React from 'react'
import { useState } from 'react'
import axiosInstance from '../../services/api'
function useFetchLikesOfChanel(channelId) {
    const [channelLikes,setChannelLikes] = useState(0)

    const fetchTotalChannelLikes = async()=>{
        const res = await axiosInstance.get('/likes/total-likes-off-user-channel-videos')
        if(!res){
          console.error("response not obtain from backend")
        }
        setChannelLikes(res.data.data.videoLikesCount)
      }
    return {channelLikes,fetchTotalChannelLikes}
}

export default useFetchLikesOfChanel