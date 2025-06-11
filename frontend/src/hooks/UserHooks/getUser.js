import React, { useEffect, useState } from 'react'
import axiosInstance from '../../services/api'
import { useUser } from '../../context/authcontext'

function getUser() {
  const [userInfo, setUserInfo] = useState({})
  const { user } = useUser()

  const findUser = async () => {
    try {
      const response = await axiosInstance.get("/users/get-current-user")
      if (!response.data.success) {
        console.log("Response not obtained from backend")
        return
      }
      setUserInfo(response.data.data.newUser)
    } catch (error) {
      console.error("Failed to load user info", error)
    }
  }

  useEffect(() => {
    if (user) {
      findUser()
    }
  }, [user])

  return { userInfo, setUserInfo, findUser }
}

export default getUser 