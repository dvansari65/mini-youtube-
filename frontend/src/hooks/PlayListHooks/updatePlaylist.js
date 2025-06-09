import React, { useState } from 'react'
import axiosInstance from '../../services/api'

function useUpdatePlaylist(playListId) {
  const [updatedPlaylist,setUpdatedPlaylist] = useState({
    title:"",
    description:""
  })
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(true)
  const [message,setMessage] = useState('')
  
  const UpdatePlaylist = async()=>{
    setLoading(true)
    setError('')
    setMessage('');
    try {
        const res = await axiosInstance.patch(`/playList/update-playlist/${playListId}`,updatedPlaylist)
        if(res.data.success){
            setUpdatedPlaylist(prev=>(
                {
                    ...prev,
                    ...res.data.data
                }
            ))
           
        }
        setMessage("playlist updated successfully")
        setLoading(false)
    } catch (error) {
        console.error("failed to update the playlist")
        setError(error?.response.data.message || "server error")
    }finally{
        setLoading(false)
    }
  }
  return {updatedPlaylist,setUpdatedPlaylist,message,setMessage,UpdatePlaylist,error,loading}
}

export default useUpdatePlaylist