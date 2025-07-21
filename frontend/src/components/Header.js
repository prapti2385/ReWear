import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, LayoutDashboard, PlusCircle, ShieldCheck } from 'lucide-react';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to home after logout
    };

    return (
        <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
                        ReWear
                    </Link>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link to="/browse" className="text-gray-600 hover:text-indigo-600 transition-colors px-2 py-1 rounded-md text-sm sm:text-base">Browse</Link>
                        {isAuthenticated ? (
                            <>
                                {user?.role === 'admin' && (
                                     <Link to="/admin" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center px-2 py-1 rounded-md text-sm sm:text-base"><ShieldCheck size={18} className="mr-1"/>Admin</Link>
                                )}
                                <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center px-2 py-1 rounded-md text-sm sm:text-base"><LayoutDashboard size={18} className="mr-1"/>Dashboard</Link>
                                <Link to="/add-item" className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center px-2 py-1 rounded-md text-sm sm:text-base"><PlusCircle size={18} className="mr-1"/>List Item</Link>
                                <button onClick={handleLogout} className="text-gray-600 hover:text-indigo-600 transition-colors flex items-center px-2 py-1 rounded-md text-sm sm:text-base"><LogOut size={18} className="mr-1"/>Logout</button>
                            </>
                        ) : (
                            <Link to="/login" className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700 transition-all text-sm font-semibold flex items-center">
                                <LogIn size={16} className="mr-2"/> Login
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;