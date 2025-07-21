import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await api.login(email, password);
            login(data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-3xl font-bold text-center text-gray-900">Welcome Back!</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm text-center">{error}</p>}
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                        <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="password"  className="text-sm font-medium text-gray-700">Password</label>
                        <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    New to ReWear? <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
