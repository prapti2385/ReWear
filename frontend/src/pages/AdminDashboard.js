import React, { useState, useEffect } from 'react';
import api from '../api';
import { CheckCircle, XCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [pendingItems, setPendingItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const fetchPending = async () => {
        setLoading(true);
        try {
            const items = await api.getPendingItems();
            setPendingItems(items);
        } catch (error) {
            console.error("Failed to fetch pending items", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (id) => {
        try {
            await api.approveItem(id);
            // Refresh the list after approval
            fetchPending();
        } catch (error) {
            alert('Failed to approve item.');
        }
    };

    const handleReject = async (id) => {
        try {
            await api.rejectItem(id);
            // Refresh the list after rejection
            fetchPending();
        } catch (error) {
            alert('Failed to reject item.');
        }
    };

    if (loading) return <div className="text-center p-10">Loading pending items...</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin - Item Approval</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {pendingItems.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {pendingItems.map(item => (
                                <li key={item._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-4">
                                    <div>
                                        <p className="font-semibold text-lg text-gray-800">{item.title}</p>
                                        <p className="text-sm text-gray-500">by {item.owner?.email || 'Unknown'}</p>
                                    </div>
                                    <div className="flex space-x-2 mt-2 sm:mt-0">
                                        <button onClick={() => handleApprove(item._id)} className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors" title="Approve">
                                            <CheckCircle />
                                        </button>
                                        <button onClick={() => handleReject(item._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors" title="Reject">
                                            <XCircle />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-8">No items are currently pending approval.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
