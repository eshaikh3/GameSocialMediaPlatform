import React, { useState, useContext, createContext } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    // State
    const [userLoggedIn, setUserLoggedIn] = useState(false)

    // Function
    const login = () => {
        setUserLoggedIn(true)
    }

    const logout = () => {
        setUserLoggedIn(false)
    }

    return (
        <AuthContext.Provider value={{ userLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hooks
export const useAuth = () => {
    return useContext(AuthContext)
}
