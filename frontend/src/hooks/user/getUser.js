import React, { useEffect } from 'react'
import axiosInstance from '../../services/api'
import { useUser } from '../../context/authcontext'

function getUser() {
  const [userInfo,setUserInfo] = useState({})
const {user} = useUser()
  const findUser = async ()=>{
    try {
        const user = axiosInstance.get("/users/get-current-user")
        if(!user){
            console.log(user.data.success || "response not obtain from backend" )
            return;
        }
        setUserInfo(await user.data.data.newUser)
    } catch (error) {
        console.error("failed to load user info",error)
    }
}
useEffect(()=>{
    if(user){
        findUser()
    }
},[user])
  return { userInfo,setUserInfo,findUser}
}

export default getUser