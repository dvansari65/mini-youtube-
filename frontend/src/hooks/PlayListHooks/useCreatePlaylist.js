import React, { useState } from 'react'
import axiosInstance from '../../services/api'

function useCreatePlaylist() {
  const [playList,setplayList] = useState()
  const [formData,setFormData] = useState({
    title:"",
    description:''
  })
  const [countPlayList,setCountPlayList] = useState(0)

  const createPlayList = async()=>{
    try {
        const res = await axiosInstance.post('/playList/create-playlist',formData)
        if(!res){
            console.error('response not obtain from backend',error)
        }
        setFormData(prev=>(
          {
            ...prev,
            ...res.data.data.createdPlayList
          }

        ))
        setplayList(prev=>(
            [
              ...prev,
              ...res.data.data.createdPlayList
            ]
        ))
        setCountPlayList(res.data.data.countPlaylist)
    } catch (error) {
        console.error("playlist can not be create!!",error)
    }
  }
  return {playList,setplayList,countPlayList,createPlayList}

}

export default useCreatePlaylist