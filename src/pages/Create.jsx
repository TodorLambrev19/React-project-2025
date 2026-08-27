import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../api/products';

export default function Create() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        imageUrl: '',
        price: '',
        description: '',
        soldOut: false,
        preOrder: false,
        imagesText: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
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
            await createProduct({
                title: formData.title,
                category: formData.category,
                imageUrl: formData.imageUrl,
                price: Number(formData.price),
                description: formData.description,
                soldOut: formData.soldOut,
                preOrder: formData.preOrder,
                images: formData.imagesText.split('\n').map(s => s.trim()).filter(Boolean),
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
            <h2 style={{ color: 'white', marginBottom: '2rem', textTransform: 'uppercase' }}>
                ADD NEW DROP
            </h2>

            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

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

                <div className="form-group">
                    <textarea
                        name="imagesText"
                        placeholder="Additional image URLs, one per line (Optional, e.g. /images/back.png)"
                        value={formData.imagesText}
                        onChange={handleChange}
                        rows="3"
                    ></textarea>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                    <input
                        type="checkbox"
                        id="soldOut"
                        name="soldOut"
                        checked={formData.soldOut}
                        onChange={handleChange}
                        style={{ width: 'auto' }}
                    />
                    <label htmlFor="soldOut" style={{ cursor: 'pointer' }}>Mark as sold out</label>
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                    <input
                        type="checkbox"
                        id="preOrder"
                        name="preOrder"
                        checked={formData.preOrder}
                        onChange={handleChange}
                        style={{ width: 'auto' }}
                    />
                    <label htmlFor="preOrder" style={{ cursor: 'pointer' }}>Mark as pre-order (hero button links here)</label>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? 'ADDING...' : 'ADD PRODUCT'}
                </button>
            </form>
        </div>
    );
}