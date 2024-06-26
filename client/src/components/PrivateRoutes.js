import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoutes ({isLoggedIn}) {
    return (
        isLoggedIn ? <Outlet /> : <Navigate to='/login' />
    )
};