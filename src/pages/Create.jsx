import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext'; 

export default function Create() {
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        imageUrl: '',
        price: '',
        description: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setError('');
        setLoading(true);

        try {
            if (!formData.title || !formData.price || !formData.imageUrl) {
                return setError('Моля попълнете задължителните полета!');
            }
            await addDoc(collection(db, "products"), {
                title: formData.title,
                category: formData.category,
                imageUrl: formData.imageUrl,
                price: Number(formData.price), 
                description: formData.description,
                ownerId: user ? user.uid : 'anonymous', 
                createdAt: new Date()
            });

            
            alert('Продуктът е добавен успешно!'); 
            navigate('/'); 

        } catch (err) {
            console.error(err);
            setError('Грешка при записване: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <h2 style={{color: 'white', marginBottom: '2rem', textTransform: 'uppercase'}}>
                ADD NEW DROP
            </h2>

            {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Product Name (e.g. Black Hoodie)"
                        value={formData.title}
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div className="form-group">
                    <input 
                        type="text" 
                        name="category" 
                        placeholder="Category (e.g. Hoodies, Pants)"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group">
                    <input 
                        type="text" 
                        name="imageUrl" 
                        placeholder="Image URL (e.g. /images/feat-1.jpg)"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div className="form-group">
                    <input 
                        type="number" 
                        name="price" 
                        placeholder="Price ($)"
                        value={formData.price}
                        onChange={handleChange}
                        required 
                    />
                </div>

                <div className="form-group">
                    <textarea 
                        name="description" 
                        placeholder="Description (Optional)"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                    ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'ADDING...' : 'ADD PRODUCT'}
                </button>
            </form>
        </div>
    );
}