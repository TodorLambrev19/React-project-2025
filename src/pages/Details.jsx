import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { getProductById, deleteProduct } from '../api/products';
import { useAuth } from '../contexts/AuthContext';

export default function Details() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            try {
                await deleteProduct(id);
                alert("Deleted successfully!");
                navigate('/');
            } catch (error) {
                console.error("Failed to delete:", error);
            }
        }
    };

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading details...</div>;
    if (!product) return <div style={{textAlign: 'center'}}>Product not found!</div>;

    const isOwner = user && user.uid === product.ownerId;

    return (
        <div className="form-container" style={{maxWidth: '800px', textAlign: 'left', display: 'flex', gap: '2rem'}}>
            <div style={{flex: 1}}>
                <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    style={{width: '100%', borderRadius: '8px', border: '1px solid #333'}} 
                />
            </div>
            
            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                <h1 style={{marginBottom: '10px'}}>{product.title}</h1>
                <span style={{color: '#e63946', fontSize: '1.5rem', fontWeight: 'bold'}}>${product.price}</span>
                <span style={{color: '#888', marginBottom: '20px'}}>Category: {product.category}</span>
                
                <p style={{lineHeight: '1.6', color: '#ccc', marginBottom: 'auto'}}>
                    {product.description}
                </p>

                {isOwner && (
                    <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                        {/* БУТОН EDIT */}
                        <Link 
                            to={`/edit/${id}`} 
                            style={{
                                backgroundColor: '#444', 
                                color: 'white', 
                                padding: '10px 20px', 
                                textDecoration: 'none', 
                                fontWeight: 'bold',
                                borderRadius: '4px'
                            }}
                        >
                            EDIT
                        </Link>

                        {/* БУТОН DELETE */}
                        <button 
                            onClick={handleDelete} 
                            style={{backgroundColor: '#e63946'}}
                        >
                            DELETE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}