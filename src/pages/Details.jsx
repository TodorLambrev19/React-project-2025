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
    const staticProducts = {
        "static-1": {
            title: "\"SURVIVE ALONE\" - T-SHIRT",
            price: "65.00",
            imageUrl: "/images/survive alone.jpg",
            category: "T-Shirts",
            description: "Heavyweight cotton. Oversized fit. The print is screenprinted with a mix of embroidered letters."
        },
        "static-2": {
            title: "\"FU*K YOU TRAITOR\" - T-SHIRT",
            price: "65.00",
            imageUrl: "/images/Traitor.jpg",
            category: "T-Shirts",
            description: "Premium fabric with a bold statement print on the back. Limited stock available."
        },
        "static-3": {
            title: "\"CRAZY BASTARD\" - HAT",
            price: "10.00",
            imageUrl: "/images/hat.jpg",
            category: "Accessories",
            description: "Classic hat fit. Embroidered logo. "
        },
        "static-4": {
            title: "\"TARGET COLAB\" - LONG SLEEVE",
            price: "50.00",
            imageUrl: "/images/long-sleeve.jpg",
            category: "Long Sleeves",
            description: "A special collaboration piece. PALM ANGELS inspired. Embroidered logo on chest."
        }
    };

    useEffect(() => {
        async function fetchProduct() {
            if (staticProducts[id]) {
                setProduct(staticProducts[id]);
                setLoading(false);
                return;
            }
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

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading details...</div>;
    if (!product) return <div style={{ textAlign: 'center', color: 'white' }}>Product not found!</div>;

    const isOwner = user && user.uid === product.ownerId;

    return (
        <div className="form-container" style={{ maxWidth: '1000px', textAlign: 'left', display: 'flex', gap: '4rem', margin: '4rem auto', alignItems: 'stretch' }}>
            <div style={{ flex: 1 }}>
                <img
                    src={product.imageUrl}
                    alt={product.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #333' }}
                />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ marginBottom: '10px', textTransform: 'uppercase' }}>{product.title}</h1>
                <span style={{ color: '#e63946', fontSize: '1.5rem', fontWeight: 'bold' }}>${product.price}</span>
                <span style={{ color: '#888', marginBottom: '20px' }}>Category: {product.category}</span>

                <p style={{ lineHeight: '1.7', color: '#ccc' }}>
                    {product.description}
                </p>

                {isOwner && (
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: 'auto',
                        paddingTop: '20px'
                    }}>
                        <Link
                            to={`/edit/${id}`}
                            style={{
                                backgroundColor: '#444',
                                color: 'white',
                                padding: '10px 15px',
                                textDecoration: 'none',
                                fontWeight: 'bold',
                                borderRadius: '4px'
                            }}
                        >
                            EDIT
                        </Link>

                        <button
                            onClick={handleDelete}
                            style={{
                                backgroundColor: '#e63946',
                                color: 'white',
                                padding: '10px 10px',
                                border: 'none',
                                fontWeight: 'bold',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            DELETE
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}