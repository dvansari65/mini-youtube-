
import React from 'react'
import { useUser } from '../context/authcontext'
import {  Outlet, Navigate } from 'react-router-dom'
function ProtectedRoute({children}) {
    const {user,loading} = useUser()
    
    if(loading){
      return <div>loading....</div>
    }
    if(!user){
      <Navigate to="/login" />
    }
    return children? children : <Outlet/>;
  
}

export default ProtectedRoute