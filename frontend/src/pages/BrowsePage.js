// /src/pages/BrowsePage.js
import React, { useState, useEffect } from 'react';
import api from '../api';
import ItemCard from '../components/ItemCard';

const BrowsePage = () => {
    const [items, setItems] = useState([]); // Initial state is an empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const data = await api.getItems();
                // Ensure data is an array before setting it
                if (Array.isArray(data)) {
                    setItems(data);
                } else {
                    // If the API returns something unexpected, treat it as an empty list
                    setItems([]);
                    console.warn("API did not return an array for items:", data);
                }
            } catch (err) {
                setError('Could not fetch items. Please try again later.');
                console.error("Failed to fetch items", err);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    if (loading) {
        return <div className="text-center p-10">Loading items...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Browse All Items</h1>
                
                {/* THE FIX IS HERE: Check if `items` exists before checking its length. */}
                {items && items.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {items.map(item => <ItemCard key={item._id} item={item} />)}
                    </div>
                ) : (
                    <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700">No Items Found</h2>
                        <p className="text-gray-500 mt-2">It looks like there are no items available right now. Why not be the first to list something?</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowsePage;