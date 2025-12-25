import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user } = useContext(AuthContext);

    // If user is not authenticated (null), redirect to Login
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // If authenticated, render the child route
    return <Outlet />;
};

export default ProtectedRoute;
