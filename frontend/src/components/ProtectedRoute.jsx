import React from 'react'
import { useUser } from '../context/authcontext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
    const { user, loading } = useUser()
   
    
    if (loading) {
        return 
    }

    if (!user) {
        // Redirect to login but save the attempted url
        return <Navigate to="/login" replace />
    }

    return children
}

export default ProtectedRoute