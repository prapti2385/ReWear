// /src/pages/AddItemPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { UploadCloud, X } from 'lucide-react';

const AddItemPage = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        size: '',
        condition: 'Used - Like New',
        tags: '',
        pointsValue: '', // Added pointsValue to initial state
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([...images, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (images.length === 0) {
            setError('Please upload at least one image.');
            setLoading(false);
            return;
        }

        try {
            // 1. Upload images to our own backend
            const imageFormData = new FormData();
            images.forEach(image => {
                imageFormData.append('images', image);
            });
            const uploadResponse = await api.uploadImages(imageFormData);
            const imageUrls = uploadResponse.imageUrls;

            // 2. Prepare item data with image URLs
            const itemData = { 
                ...formData, 
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
                images: imageUrls,
            };

            // 3. Submit item data to your backend
            await api.addItem(itemData);
            
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to add item.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">List a New Item</h1>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                    {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm text-center">{error}</p>}
                    
                    {/* Image Upload Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload files</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative">
                                    <img src={preview} alt={`preview ${index}`} className="h-24 w-24 object-cover rounded-md" />
                                    <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1">
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Other Form Fields */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="e.g., Jackets, Dresses" required />
                        </div>
                        <div>
                            <label htmlFor="size" className="block text-sm font-medium text-gray-700">Size</label>
                            <input type="text" name="size" id="size" value={formData.size} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="e.g., M, 10, L" required />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="pointsValue" className="block text-sm font-medium text-gray-700">Point Value</label>
                        <input 
                            type="number" 
                            name="pointsValue" 
                            id="pointsValue" 
                            value={formData.pointsValue} 
                            onChange={handleChange} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" 
                            placeholder="e.g., 50" 
                            required 
                            min="0"
                        />
                    </div>
                    <div>
                        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
                        <select name="condition" id="condition" value={formData.condition} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                            <option>New with tags</option>
                            <option>Used - Like New</option>
                            <option>Used - Good</option>
                            <option>Used - Fair</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                        <input type="text" name="tags" id="tags" value={formData.tags} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="e.g., vintage, denim, 90s" />
                    </div>
                    
                    <button type="submit" disabled={loading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                        {loading ? 'Submitting...' : 'Submit Item'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddItemPage;