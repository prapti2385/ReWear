import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ItemCard from '../components/ItemCard';

const LandingPage = () => {
    const navigate = useNavigate();
    const [featuredItems, setFeaturedItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const items = await api.getItems();
                setFeaturedItems(items.slice(0, 3)); // Show first 3 as featured
            } catch (error) {
                console.error("Failed to fetch featured items", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <div className="relative bg-indigo-600">
                <div className="absolute inset-0">
                    <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1555529771-835f59fc5efe?q=80&w=2070" alt="Clothing rack" />
                    <div className="absolute inset-0 bg-indigo-800 mix-blend-multiply" aria-hidden="true"></div>
                </div>
                <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Trade, Don't Trash</h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">Join the sustainable fashion movement. Swap your pre-loved clothes and refresh your style without spending a dime.</p>
                    <div className="mt-8 flex justify-center gap-4">
                        <button onClick={() => navigate('/browse')} className="bg-white text-indigo-600 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-all transform hover:scale-105">
                            Start Swapping
                        </button>
                        <button onClick={() => navigate('/add-item')} className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-indigo-600 transition-all">
                            List an Item
                        </button>
                    </div>
                </div>
            </div>

            {/* Featured Items Section */}
            <div className="container mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Freshly Listed</h2>
                {loading ? (
                    <p className="text-center text-gray-500">Loading items...</p>
                ) : featuredItems.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredItems.map(item => <ItemCard key={item._id} item={item} />)}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">No items available right now. Be the first to list something!</p>
                )}
            </div>
        </div>
    );
};

export default LandingPage;