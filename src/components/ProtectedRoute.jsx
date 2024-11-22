import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({children}) => {
    const { usuario } = useAuth();

    if(!usuario){
        return <Navigate to='/login' />
    }

    return <Outlet />
}

