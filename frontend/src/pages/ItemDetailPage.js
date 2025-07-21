// /src/pages/ItemDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { X, Star } from 'lucide-react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// --- Swap Request Modal Component ---
const SwapModal = ({ show, onClose, userItems, onSwapSubmit, requestedItem }) => {
    const [selectedItem, setSelectedItem] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!show) return null;

    const handleSubmit = async () => {
        if (!userItems || userItems.length === 0) {
            alert('You have no available items to offer for a swap.');
            return;
        }
        if (!selectedItem) {
            alert('Please select an item to offer for the swap.');
            return;
        }
        setIsSubmitting(true);
        await onSwapSubmit({
            requestedItemId: requestedItem._id,
            offeredItemId: selectedItem,
            swapType: 'direct'
        });
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Request a Swap</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><X size={24} /></button>
                </div>
                {(!userItems || userItems.length === 0) ? (
                    <p className="text-center text-gray-600 bg-gray-100 p-4 rounded-md">
                        You have no items currently marked as "available" to offer for a swap.
                    </p>
                ) : (
                    <>
                        <p className="mb-4">Select one of your items to offer in exchange for <span className="font-semibold">{requestedItem.title}</span>.</p>
                        <div className="mb-4">
                            <label htmlFor="user-items" className="block text-sm font-medium text-gray-700">Your Available Items</label>
                            <select 
                                id="user-items"
                                value={selectedItem}
                                onChange={(e) => setSelectedItem(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="" disabled>-- Select an item --</option>
                                {userItems.map(item => (
                                    <option key={item._id} value={item._id}>{item.title}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button 
                        onClick={handleSubmit} 
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
                        disabled={!userItems || userItems.length === 0 || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Item Detail Page Component ---
const ItemDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user: authUser } = useAuth();
    
    const [item, setItem] = useState(null);
    const [userItems, setUserItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const itemData = await api.getItem(id);
                setItem(itemData);

                if (isAuthenticated) {
                    const dashboardData = await api.getDashboard();
                    const availableItems = dashboardData.userItems.filter(i => i.status === 'available');
                    setUserItems(availableItems);
                }
            } catch (err) {
                setError('Could not fetch item details.');
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id, isAuthenticated]);

    const handleSwapRequest = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (item.owner._id === authUser.id) {
            alert("You cannot request a swap for your own item.");
            return;
        }
        setShowModal(true);
    };

    const handleSwapSubmit = async (swapData) => {
        try {
            await api.createSwap(swapData);
            alert('Swap request submitted successfully!');
            setShowModal(false);
        } catch (err) {
            console.error('Swap submission failed:', err);
            alert(`Error: ${err.message}`);
        }
    };

    const handleRedeem = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (item.owner._id === authUser.id) {
            alert("You cannot redeem your own item with points.");
            return;
        }
        const confirmation = window.confirm(`Are you sure you want to redeem this item for ${item.pointsValue} points? This cannot be undone.`);
        if (confirmation) {
            try {
                await api.redeemWithPoints(item._id);
                alert('Item redeemed successfully!');
                navigate('/dashboard'); 
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    if (loading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!item) return <div className="text-center p-10">Item not found.</div>;

    const placeholderImage = 'https://placehold.co/600x700/F3F4F6/9CA3AF?text=No+Image';
    const imageUrl = item.images && item.images.length > 0 ? `${API_URL}${item.images[0]}` : placeholderImage;

    return (
        <>
            <div className="bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden md:flex">
                        <div className="md:w-1/2">
                            <img 
                                className="h-full w-full object-cover max-h-[700px]" 
                                src={imageUrl} 
                                alt={item.title}
                                onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }}
                            />
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col">
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wide">{item.category}</p>
                                        <h1 className="text-4xl font-bold text-gray-900 mt-1">{item.title}</h1>
                                        <p className="text-md text-gray-500 mt-2">Listed by {item.owner.email}</p>
                                    </div>
                                    <div className="flex items-center bg-yellow-100 text-yellow-800 text-lg font-bold px-4 py-2 rounded-lg">
                                        <Star size={20} className="mr-2" />
                                        {item.pointsValue}
                                    </div>
                                </div>
                                <p className="text-gray-700 mt-4 text-lg">{item.description}</p>
                                <div className="mt-6">
                                    <h3 className="font-semibold text-lg mb-2">Details</h3>
                                    <div className="flex space-x-6 text-sm">
                                        <p><strong>Size:</strong> {item.size}</p>
                                        <p><strong>Condition:</strong> {item.condition}</p>
                                    </div>
                                </div>
                                <div className="mt-6 flex flex-wrap gap-2">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-700">#{tag}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="mt-8 space-y-4">
                                <button 
                                    onClick={handleSwapRequest}
                                    className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all"
                                >
                                    Request Direct Swap
                                </button>
                                <button 
                                    onClick={handleRedeem}
                                    className="w-full bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-all"
                                >
                                    Redeem with Points
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <SwapModal 
                show={showModal}
                onClose={() => setShowModal(false)}
                userItems={userItems}
                onSwapSubmit={handleSwapSubmit}
                requestedItem={item}
            />
        </>
    );
};

export default ItemDetailPage;