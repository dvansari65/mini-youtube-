import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../../services/api'

function useFetchMyVideos() {
    const [myVideos,setMyVideos]  = useState([])
    const [error,setError] = useState('')
    const [loading,setLoading] = useState(true)
    async function  fetchMyVideos(){
        try {
            const res = await axiosInstance.get('/videos/my-videos')
            if(!res){
            console.log("response not obtain from backend",error)
            throw error
            }
            setMyVideos(res.data.data)
        } catch (error) {
            console.error("videos can not be fetched",error)
        }
   
    }
    useEffect(()=>{
        fetchMyVideos()
    },[])

     return {myVideos,fetchMyVideos,error,setLoading,setError,loading}
}
export default useFetchMyVideos

