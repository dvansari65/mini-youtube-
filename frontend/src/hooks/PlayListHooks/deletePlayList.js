import React from 'react'
import axiosInstance from '../../services/api'

function useDeletePlayList(playListId) {
  const [deletedPlayList,setDeletedPlayList] = useState({})
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(true)
  const DeletePlayList = async ()=>{
   try {
     const res = await axiosInstance.delete(`/playList/delete-playlist/${playListId}`)
     if(res.data.success){
        setDeletedPlayList(res.data.data)
     }
     setError('')
     setLoading(false)
   } catch (error) {
    console.log("failed to delete playlist",error)
   }
  }
  return {deletedPlayList,setDeletedPlayList,error,loading,DeletePlayList}
}

export default useDeletePlayList