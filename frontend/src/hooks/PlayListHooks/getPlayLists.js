import React, { useEffect } from 'react'
import axiosInstance from '../../services/api'

function useGetPlayLists() {
  const [allPlaylist,setAllPlaylist] = useState([])
  const [error,setError] = useState('')
  const [ loading,setLoading] = useState(false)
  const [message,setMessage] = useState('')

  const obtainAllPlaylist = async()=>{
    try {
        const res = await axiosInstance.get("/playList/get-user-playlist")
        if(res.data.success){
            setMessage("all playlists obtain")
            setAllPlaylist(res.data.data.allPlayLists)
        }
        setError('')
    } catch (error) {
        console.error("failed to obtain all playlist",error)
        setError(error?.res.data.message || "server error")
    }finally{
        setLoading(false)
    }
}

useEffect(()=>{
    obtainAllPlaylist()
},[])

return {allPlaylist,error,loading,message,obtainAllPlaylist}

}

export default useGetPlayLists