
import React from 'react'
import { useUser } from '../context/authcontext'
import {  useNavigate } from 'react-router-dom'
function ProtectedRoute({children}) {
    const {user,loading} = useUser()
    const navigate = useNavigate()
    if(loading){
      return <div>loading....</div>
    }
    if(!user){
      navigate("/login")
    }
    return children;
  
}

export default ProtectedRoute