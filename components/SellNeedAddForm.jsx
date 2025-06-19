'use client';

import { useState } from 'react';

const emptyItem = { type: '', price: '', description: '', image: '' };


const AddSellNeed = () => {
    const SellingNeedsForm = () => {
        const [formData, setFormData] = useState({
            selling: {
                selling1: { ...emptyItem },
                selling2: { ...emptyItem },
                selling3: { ...emptyItem },
            },
            needs: {
                need1: { ...emptyItem },
                need2: { ...emptyItem },
                need3: { ...emptyItem },
            }
        });

        const handleChange = (group, key, field, value) => {
            setFormData(prev => ({
                ...prev,
                [group]: {
                    ...prev[group],
                    [key]: {
                        ...prev[group][key],
                        [field]: value
                    }
                }
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            console.log(formData);
            // Submit formData to your API endpoint here
        };

        const renderGroup = (groupName, groupLabel) => (
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">{groupLabel}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {Object.keys(formData[groupName]).map((key, index) => (
                        <div key={key} className="border p-4 rounded-md shadow-sm bg-white">
                            <h3 className="font-medium text-gray-700 mb-2 capitalize">{key}</h3>

                            <label className="block text-sm text-gray-600 mb-1">Type</label>
                            <input
                                type="text"
                                className="w-full border px-3 py-2 rounded-md mb-3"
                                value={formData[groupName][key].type}
                                onChange={(e) => handleChange(groupName, key, 'type', e.target.value)}
                            />

                            {groupName === 'selling' && (
                                <>
                                    <label className="block text-sm text-gray-600 mb-1">Price</label>
                                    <input
                                        type="text"
                                        className="w-full border px-3 py-2 rounded-md mb-3"
                                        value={formData[groupName][key].price}
                                        onChange={(e) => handleChange(groupName, key, 'price', e.target.value)}
                                    />
                                </>
                            )}

                            <label className="block text-sm text-gray-600 mb-1">Description</label>
                            <input
                                type="text"
                                className="w-full border px-3 py-2 rounded-md mb-3"
                                value={formData[groupName][key].description}
                                onChange={(e) => handleChange(groupName, key, 'description', e.target.value)}
                            />

                            <label className="block text-sm text-gray-600 mb-1">Image Filename</label>
                            <input
                                type="text"
                                placeholder="e.g. image.jpg"
                                className="w-full border px-3 py-2 rounded-md"
                                value={formData[groupName][key].image}
                                onChange={(e) => handleChange(groupName, key, 'image', e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
        return (
            <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">Add Selling & Needs</h1>
                {renderGroup('selling', 'Selling Items')}
                {renderGroup('needs', 'Needs')}
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        Submit
                    </button>
                </div>
            </form>
    
        )
    };
    
 
}; export default AddSellNeed;