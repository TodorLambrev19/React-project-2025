import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

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

    // Изтегляне на данните
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFormData(docSnap.data());
                } else {
                    alert("Продуктът не съществува!");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);

        try {
            const docRef = doc(db, "products", id);
            await updateDoc(docRef, {
                title: formData.title,
                category: formData.category,
                imageUrl: formData.imageUrl,
                price: Number(formData.price),
                description: formData.description
            });
            navigate(`/details/${id}`); 
        } catch (err) {
            console.error(err);
            alert('Грешка при обновяване: ' + err.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div style={{textAlign: 'center', color: 'white', marginTop: '50px'}}>Loading data...</div>;

    return (
        <div className="form-container">
            <h2 style={{color: 'white', marginBottom: '2rem', textTransform: 'uppercase'}}>
                EDIT DROP
            </h2>

            <form onSubmit={handleSubmit}>
                {}
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

                {}
                <div className="form-group">
                    <input 
                        type="text" 
                        name="category" 
                        placeholder="Category"
                        value={formData.category}
                        onChange={handleChange}
                    />
                </div>

                {}
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

                {}
                <div style={{textAlign: 'center', marginBottom: '1.5rem', minHeight: '20px'}}>
                    {formData.imageUrl ? (
                        <img 
                            src={formData.imageUrl} 
                            alt="Preview" 
                            style={{
                                maxWidth: '150px', 
                                borderRadius: '4px', 
                                border: '1px solid #333'
                            }}
                            onError={(e) => {e.target.style.display='none'}}
                        />
                    ) : null}
                </div>

                {}
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

                {}
                <div className="form-group">
                    <textarea 
                        name="description" 
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                    ></textarea>
                </div>

                <button type="submit" className="submit-btn" disabled={updating}>
                    {updating ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
            </form>
        </div>
    );
}