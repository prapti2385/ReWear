import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Use a robust JWT decoding library

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: localStorage.getItem('token'),
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                // Check if token is expired
                if (decodedUser.exp * 1000 > Date.now()) {
                    setAuthState({
                        token,
                        user: decodedUser.user, // The payload from your JWT
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } else {
                    // Token expired, clear it
                    localStorage.removeItem('token');
                    setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false });
                }
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
                setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false });
            }
        } else {
            setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decodedUser = jwtDecode(token);
        setAuthState({
            token,
            user: decodedUser.user,
            isAuthenticated: true,
            isLoading: false,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthState({
            token: null,
            user: null,
            isAuthenticated: false,
            isLoading: false,
        });
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {!authState.isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};