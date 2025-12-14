import { useState } from 'react';
import { createProduct } from '../api/products';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { stockPhotos } from '../utils/stockPhotos'; 

export default function Create() {
    const navigate = useNavigate();
    const { user } = useAuth(); 

    
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        imageUrl: stockPhotos[0].url, 
        price: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!user) {
            alert("You must be logged in!");
            return;
        }

        try {
            await createProduct({
                ...formData,
                price: Number(formData.price), 
                ownerId: user.uid 
            });
            
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Error creating product');
        }
    };

    return (
        <div className="form-container">
            <h2>Add New Item</h2>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input 
                    type="text" 
                    name="title" 
                    placeholder="e.g. Black Hoodie" 
                    onChange={handleChange} 
                    required 
                />
                
                <label>Category</label>
                <input 
                    type="text" 
                    name="category" 
                    placeholder="e.g. Hoodies" 
                    onChange={handleChange} 
                    required 
                />
                
                {}
                <label>Select Official Photo</label>
                <select 
                    name="imageUrl" 
                    value={formData.imageUrl} 
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '15px',
                        backgroundColor: '#2a2a2a',
                        color: 'white',
                        border: '1px solid #444',
                        borderRadius: '4px'
                    }}
                >
                    {stockPhotos.map((photo, index) => (
                        <option key={index} value={photo.url}>
                            {photo.name}
                        </option>
                    ))}
                </select>

                {}
                {formData.imageUrl && (
                    <div style={{marginBottom: '15px', textAlign: 'center'}}>
                         <img src={formData.imageUrl} alt="Preview" style={{maxHeight: '150px', borderRadius: '8px'}} />
                    </div>
                )}
                
                <label>Price ($)</label>
                <input 
                    type="number" 
                    name="price" 
                    placeholder="59" 
                    onChange={handleChange} 
                    required 
                />
                
                <label>Description</label>
                <textarea 
                    name="description" 
                    placeholder="Product Description..." 
                    onChange={handleChange}
                    rows="4"
                />

                <button type="submit">Create Listing</button>
            </form>
        </div>
    );
}