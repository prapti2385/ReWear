import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user, isLoading } = useAuth();

    if (isLoading) {
        // You can return a loading spinner here
        return <div className="text-center p-10">Loading...</div>;
    }

    if (!isAuthenticated) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to. This allows us to send them along to that page after they login.
        return <Navigate to="/login" replace />;
    }

    if (adminOnly && user?.role !== 'admin') {
        // If the route is for admins only and the user is not an admin,
        // redirect them to a "not authorized" page or the home page.
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;