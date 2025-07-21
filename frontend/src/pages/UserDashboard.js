// /src/pages/UserDashboard.js
import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Check, X } from 'lucide-react';

const UserDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user: authUser } = useAuth();

    const fetchData = useCallback(async () => {
        // Don't set loading to true here, to avoid flicker on re-fetch
        try {
            const dashboardData = await api.getDashboard();
            setData(dashboardData);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            setData(null); // Clear data on error
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAccept = async (swapId) => {
        try {
            await api.acceptSwap(swapId);
            fetchData();
        } catch (error) {
            alert(`Error accepting swap: ${error.message}`);
        }
    };

    const handleReject = async (swapId) => {
        try {
            await api.rejectSwap(swapId);
            fetchData();
        } catch (error) {
            alert(`Error rejecting swap: ${error.message}`);
        }
    };

    if (loading) {
        return <div className="text-center p-10">Loading dashboard...</div>;
    }

    // --- FIX 1: Add a check for the entire `data` object ---
    if (!data || !data.user) {
        return <div className="text-center p-10">Could not load dashboard data. Please try logging in again.</div>;
    }

    const { user, userItems, userSwaps } = data;

    const getStatusChip = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            case 'swapped': return 'bg-gray-100 text-gray-800';
            case 'pending': return 'bg-orange-100 text-orange-800';
            case 'accepted': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    {/* --- FIX 2: Use optional chaining `?.` for safety --- */}
                    <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.email || 'User'}</h1>
                    <p className="text-indigo-600 font-semibold text-lg mt-1">Points Balance: {user?.points || 0}</p>
                </div>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Your Listed Items</h2>
                        <ul className="space-y-3">
                            {userItems?.length > 0 ? userItems.map(item => (
                                <li key={item._id} className="flex justify-between items-center p-3 border rounded-md hover:bg-gray-50">
                                    <span className="font-medium">{item.title}</span>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChip(item.status)}`}>
                                        {item.status.replace('_', ' ')}
                                    </span>
                                </li>
                            )) : <p className="text-gray-500">You haven't listed any items yet.</p>}
                        </ul>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Your Swaps</h2>
                        <ul className="space-y-3">
                            {userSwaps?.length > 0 ? userSwaps.map(swap => {
                                // --- FIX 3: Add safety checks for swap participants ---
                                if (!swap.requester || !swap.responder) return null;

                                const isResponder = swap.responder._id === authUser.id;
                                const isPending = swap.status === 'pending';

                                return (
                                    <li key={swap._id} className="p-3 border rounded-md hover:bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <p className="font-medium">Swap for: {swap.requestedItem?.title || 'Deleted Item'}</p>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChip(swap.status)}`}>
                                                {swap.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {swap.requester._id === authUser.id ? `You requested from ${swap.responder.email}` : `${swap.requester.email} requested from you`}
                                        </p>
                                        
                                        {isResponder && isPending && (
                                            <div className="flex items-center space-x-2 mt-3">
                                                <button onClick={() => handleAccept(swap._id)} className="flex items-center bg-green-500 text-white text-sm font-bold py-1 px-3 rounded-lg hover:bg-green-600">
                                                    <Check size={16} className="mr-1"/> Accept
                                                </button>
                                                <button onClick={() => handleReject(swap._id)} className="flex items-center bg-red-500 text-white text-sm font-bold py-1 px-3 rounded-lg hover:bg-red-600">
                                                    <X size={16} className="mr-1"/> Reject
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                );
                            }) : <p className="text-gray-500">You have no active or completed swaps.</p>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;