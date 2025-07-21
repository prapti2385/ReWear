// /src/api/index.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
    // This is the main fetch function for JSON data.
    async fetch(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };
        if (token) {
            headers['x-auth-token'] = token;
        }

        const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An unknown error occurred');
        }
        
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null;
        }
        return response.json();
    },

    // This is the separate function specifically for uploading images.
    async uploadImages(formData) {
        const token = localStorage.getItem('token');
        const headers = {};
        if (token) {
            headers['x-auth-token'] = token;
        }
        
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Image upload failed');
        }
        return response.json();
    },

    // All the functions that use the main JSON fetcher
    login: (email, password) => api.fetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    signup: (email, password) => api.fetch('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password }) }),
    getDashboard: () => api.fetch('/dashboard'),
    getItems: () => api.fetch('/items'),
    getItem: (id) => api.fetch(`/items/${id}`),
    addItem: (itemData) => api.fetch('/items', { method: 'POST', body: JSON.stringify(itemData) }),
    createSwap: (swapData) => api.fetch('/swaps', { method: 'POST', body: JSON.stringify(swapData) }),
    acceptSwap: (swapId) => api.fetch(`/swaps/${swapId}/accept`, { method: 'PUT' }),
    rejectSwap: (swapId) => api.fetch(`/swaps/${swapId}/reject`, { method: 'PUT' }),
    redeemWithPoints: (itemId) => api.fetch('/swaps/redeem', { method: 'POST', body: JSON.stringify({ itemId }) }),
    
    // Admin functions
    getPendingItems: () => api.fetch('/admin/items'),
    approveItem: (id) => api.fetch(`/admin/items/${id}/approve`, { method: 'PUT' }),
    rejectItem: (id) => api.fetch(`/admin/items/${id}/reject`, { method: 'PUT' }),
    deleteItem: (id) => api.fetch(`/admin/items/${id}`, { method: 'DELETE' }),
};

export default api;