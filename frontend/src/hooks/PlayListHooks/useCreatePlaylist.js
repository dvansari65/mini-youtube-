import React, { useEffect } from 'react'
import axiosInstance from '../../services/api'

function useCreatePlaylist() {
  const [playList,setplayList] = useState()

  const createPlayList = async()=>{
    try {
        const res = await axiosInstance.post('/playList/create-playlist')
        if(!res){
            console.error('response not obtain from backend',error)
        }
        setplayList(res.data.data)
    } catch (error) {
        console.error("playlist can not be create!!",error)
    }
  }
  return {playList,setplayList,createPlayList}

}

export default useCreatePlaylist