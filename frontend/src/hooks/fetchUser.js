import React, { useEffect } from 'react'
import axiosInstance from '../services/api'
import { useState } from 'react'
function useFetchUser() {
  const [User,setUser] = useState(null)

  const fetchUser = async ()=>{
        const res = await axiosInstance.get('/users/get-current-user')
        if(!res){
            console.error("response not obtain from backend")
        }
        setUser(res.data.data.newUser)
  }
  useEffect(()=>{
    fetchUser()
  },[])
  return {User,fetchUser}
}

export default useFetchUser