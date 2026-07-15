import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('ps_admin_token') || null)

  const login = (t) => {
    setToken(t)
    localStorage.setItem('ps_admin_token', t)
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('ps_admin_token')
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
