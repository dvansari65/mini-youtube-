import React, { useState } from 'react'
import axiosInstance from '../../services/api'

function useUpdatePlaylist(playListId) {
  const [updatedPlaylist,setUpdatedPlaylist] = useState({})
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(true)
  const [message,setMessage] = useState('')
 
  const UpdatePlaylist = async()=>{
    try {
        const res = await axiosInstance.patch(`/playList/update-playlist/${playListId}`)
        if(res.data.success){
            setUpdatedPlaylist(res.data.data)
        }
        setError('')
        setMessage("playlist updated successfully")
        setLoading(false)
    } catch (error) {
        console.error("failed to update the playlist")
        setError(err?.response.data.message || "server error")
    }finally{
        setLoading(false)
    }
  }
  return {updatedPlaylist,setUpdatedPlaylist,message,setMessage,UpdatePlaylist,error,loading}
}

export default useUpdatePlaylist