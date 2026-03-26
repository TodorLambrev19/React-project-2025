import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, deleteProduct } from '../api/products';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Details() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState(false);

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
            description: "Classic hat fit. Embroidered logo."
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

    const handleAddToCart = () => {
        addToCart({
            id: id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading details...</div>;
    if (!product) return <div style={{ textAlign: 'center', color: 'white' }}>Product not found!</div>;

    const isOwner = user && user.uid === product.ownerId;

    return (
        <>
            <style>{`
                .details-layout {
                    display: flex;
                    gap: 4rem;
                    align-items: stretch;
                }
                @media (max-width: 768px) {
                    .details-layout {
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .details-image {
                        max-height: 400px;
                    }
                    .details-actions {
                        flex-direction: row;
                    }
                }
            `}</style>

            <div className="form-container" style={{
                maxWidth: '1000px',
                textAlign: 'left',
                margin: '4rem auto',
                padding: '2rem',
            }}>
                <div className="details-layout">
                    {/* Image */}
                    <div style={{ flex: 1, minHeight: 0 }}>
                        <img
                            className="details-image"
                            src={product.imageUrl}
                            alt={product.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '8px',
                                border: '1px solid #333',
                                display: 'block'
                            }}
                        />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h1 style={{ marginBottom: '10px', textTransform: 'uppercase', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
                            {product.title}
                        </h1>
                        <span style={{ color: '#e63946', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>
                            ${product.price}
                        </span>
                        <span style={{ color: '#888', marginBottom: '20px' }}>
                            Category: {product.category}
                        </span>
                        <p style={{ lineHeight: '1.7', color: '#ccc', marginBottom: '28px' }}>
                            {product.description}
                        </p>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: added ? '#222' : '#e63946',
                                border: added ? '1px solid #e63946' : 'none',
                                color: added ? '#e63946' : 'white',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                borderRadius: '2px',
                                marginBottom: '12px',
                                transition: 'all 0.3s ease',
                                marginTop: 0,
                            }}
                        >
                            {added ? '✓ ADDED TO CART' : 'ADD TO CART'}
                        </button>

                        {isOwner && (
                            <div className="details-actions" style={{
                                display: 'flex',
                                gap: '10px',
                                paddingTop: '12px',
                                borderTop: '1px solid #222',
                                marginTop: 'auto',
                            }}>
                                <Link
                                    to={`/edit/${id}`}
                                    style={{
                                        backgroundColor: '#444',
                                        color: 'white',
                                        padding: '10px 15px',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                        flex: 1,
                                    }}
                                >
                                    EDIT
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    style={{
                                        backgroundColor: '#e63946',
                                        color: 'white',
                                        padding: '10px',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        flex: 1,
                                        width: 'auto',
                                        marginTop: 0,
                                    }}
                                >
                                    DELETE
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}