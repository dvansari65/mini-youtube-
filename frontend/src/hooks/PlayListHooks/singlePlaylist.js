import React, { useState } from 'react'
import axiosInstance from '../../services/api'

function useGetSinglePlaylist(playlistId) {
  const [singlePlaylist,setSinglePlaylist] = useState({})
  const [loading,setLoading] = useState(true)

  const getSinglePlaylist  = async ()=>{
    setLoading(true)
   try {
     const res = await axiosInstance.get(`/playList/get-single-playlist/${playlistId}`)
     if(!res){
         console.log(res.data.message || "response not obtain from backend")
     }
     setSinglePlaylist(res?.data.data)
   } catch (error) {
        console.error("failed to get playlist!",error)
   }finally{
    setLoading(false)
   }

return {singlePlaylist,setSinglePlaylist,loading,getSinglePlaylist}
  }
}

export default useGetSinglePlaylist