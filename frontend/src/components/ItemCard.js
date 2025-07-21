// /src/components/ItemCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- ADD THIS LINE ---
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ItemCard = ({ item }) => {
    const navigate = useNavigate();
    const placeholderImage = 'https://placehold.co/400x500/F3F4F6/9CA3AF?text=No+Image';
    
    // --- UPDATE THIS LINE ---
    // Prepend the backend URL to the image path
    const imageUrl = item.images && item.images.length > 0 ? `${API_URL}${item.images[0]}` : placeholderImage;

    return (
        <div 
            className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group cursor-pointer flex flex-col"
            onClick={() => navigate(`/item/${item._id}`)}
        >
            <div className="relative h-64">
                <img 
                    src={imageUrl} // Use the full imageUrl
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }}
                />
                 <div className="absolute top-2 right-2 bg-white/80 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full shadow-sm">{item.size}</div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <h3 className="font-semibold text-lg text-gray-800 truncate flex-grow">{item.title}</h3>
                <p className="text-sm text-gray-500 mt-1">by {item.owner?.email || 'Unknown User'}</p>
            </div>
        </div>
    );
};

export default ItemCard;