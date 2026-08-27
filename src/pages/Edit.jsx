import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProduct } from '../api/products';

export default function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        imageUrl: '',
        price: '',
        description: ''
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await getProductById(id);
                setFormData({ ...product, imagesText: (product.images || []).join('\n') });
            } catch (error) {
                console.error("Error fetching product:", error);
                alert("Продуктът не съществува!");
                navigate('/');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            await updateProduct(id, {
                title: formData.title,
                category: formData.category,
                imageUrl: formData.imageUrl,
                price: Number(formData.price),
                description: formData.description,
                soldOut: formData.soldOut,
                preOrder: formData.preOrder,
                images: (formData.imagesText || '').split('\n').map(s => s.trim()).filter(Boolean),
            });
            navigate(`/details/${id}`);
        } catch (err) {
            console.error(err);
            alert('Грешка при обновяване: ' + err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', color: 'white', marginTop: '50px' }}>Loading data...</div>;

    return (
        <div className="form-container">
            <h2 style={{ color: 'white', marginBottom: '2rem', textTransform: 'uppercase' }}>
                EDIT DROP
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="title"
                        placeholder="Product Name"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="category"
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="text"
                        name="imageUrl"
                        placeholder="Image URL"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem', minHeight: '20px' }}>
                    {formData.imageUrl ? (
                        <img
                            src={formData.imageUrl}
                            alt="Preview"
                            style={{
                                maxWidth: '150px',
                                borderRadius: '4px',
                                border: '1px solid #333'
                            }}
                            onError={(e) => { e.target.style.display = 'none' }}
                        />
                    ) : null}
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
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                    ></textarea>
                </div>
                <div className="form-group">
                    <textarea
                        name="imagesText"
                        placeholder="Additional image URLs, one per line (Optional, e.g. /images/back.png)"
                        value={formData.imagesText || ''}
                        onChange={handleChange}
                        rows="3"
                    ></textarea>
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white' }}>
                    <input
                        type="checkbox"
                        id="soldOut"
                        name="soldOut"
                        checked={!!formData.soldOut}
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
                        checked={!!formData.preOrder}
                        onChange={handleChange}
                        style={{ width: 'auto' }}
                    />
                    <label htmlFor="preOrder" style={{ cursor: 'pointer' }}>Mark as pre-order (hero button links here)</label>
                </div>

                <button type="submit" className="submit-btn" disabled={updating}>
                    {updating ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
            </form>
        </div>
    );
}