import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './auth'

export const RequireAuth = ({ children }) => {
    // State/Custom Hook
    const auth = useAuth()

    if (!auth.userLoggedIn) {
        return <Navigate to="/login" />
    }

    // if userLoggedIn is true then we can pass down
    // the children
    return children
}
