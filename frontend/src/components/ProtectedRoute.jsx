import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = ({children,redirect='/auth',user}) => {
  if(!user){
    return <Navigate to={redirect} />
  }
  return children? children : <Outlet/>
}

export default ProtectedRoute