import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../api/products';
import { useAuth } from '../contexts/AuthContext';
import { stockPhotos } from '../utils/stockPhotos'; 

export default function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        imageUrl: '',
        price: '',
        description: ''
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const product = await getProductById(id);
                if (user && product.ownerId !== user.uid) {
                    alert("You are not the owner!");
                    navigate('/');
                    return;
                }
                setFormData(product);
                setLoading(false);
            } catch (error) {
                console.error(error);
                navigate('/');
            }
        }
        fetchData();
    }, [id, user, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateProduct(id, {
                ...formData,
                price: Number(formData.price)
            });
            navigate(`/details/${id}`);
        } catch (error) {
            console.error(error);
            alert("Error updating product");
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading data...</div>;

    return (
        <div className="form-container">
            <h2>Edit Item</h2>
            <form onSubmit={handleSubmit}>
                <label>Title</label>
                <input 
                    type="text" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    required 
                />
                
                <label>Category</label>
                <input 
                    type="text" 
                    name="category" 
                    value={formData.category} 
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
                    {/* Добавяме опция "Запази текущата", ако тя не е в списъка */}
                    {!stockPhotos.some(p => p.url === formData.imageUrl) && (
                        <option value={formData.imageUrl}>Keep Current Image</option>
                    )}
                    {stockPhotos.map((photo, index) => (
                        <option key={index} value={photo.url}>
                            {photo.name}
                        </option>
                    ))}
                </select>

                 <div style={{marginBottom: '15px', textAlign: 'center'}}>
                        <img src={formData.imageUrl} alt="Preview" style={{maxHeight: '150px', borderRadius: '8px'}} />
                </div>
                
                <label>Price</label>
                <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    required 
                />
                
                <label>Description</label>
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange}
                    rows="4"
                />

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}