import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSection from '../components/HeroSection';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const STATIC_PRODUCTS = {
    "static-1": { id: "static-1", title: '"SURVIVE ALONE" - T-SHIRT', price: "65.00", imageUrl: "/images/survive alone.jpg" },
    "static-2": { id: "static-2", title: '"FU*K YOU TRAITOR" - T-SHIRT', price: "65.00", imageUrl: "/images/Traitor.jpg" },
    "static-3": { id: "static-3", title: '"CRAZY BASTARD" - HAT', price: "10.00", imageUrl: "/images/hat.jpg" },
    "static-4": { id: "static-4", title: '"TARGET COLAB" - LONG SLEEVE', price: "50.00", imageUrl: "/images/long-sleeve.jpg" },
};

export default function Home() {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedId, setAddedId] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "products"));
                const productsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 2000);
    };

    return (
        <div className="home-wrapper">
            <HeroSection />

            {/* ── Static product grid ── */}
            <div className="static-section">
                {Object.values(STATIC_PRODUCTS).map((p) => (
                    <div key={p.id} className="static-card-wrapper">
                        <Link
                            to={`/details/${p.id}`}
                            className="static-card"
                            onClick={() => window.scrollTo(0, 0)}
                        >
                            <img src={p.imageUrl} alt={p.title} className="static-image" />
                            <div className="overlay" />

                            {/* Info row at bottom */}
                            <div className="static-content">
                                <div className="static-info">
                                    <p className="static-name">{p.title}</p>
                                    <p className="static-price">${p.price}</p>
                                </div>
                                <button
                                    className="static-cart-btn"
                                    onClick={(e) => handleAddToCart(e, p)}
                                >
                                    {addedId === p.id ? '✓' : '+'}
                                </button>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* ── Dynamic products ── */}
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
                <h2 className="section-title">ADDED PRODUCTS</h2>

                {loading ? (
                    <p style={{ textAlign: 'center', color: '#888' }}>Loading collection...</p>
                ) : products.length > 0 ? (
                    <div className="products-grid">
                        {products.map(product => (
                            <div key={product.id} className="product-card">
                                <Link to={`/details/${product.id}`} className="card-link">
                                    <div className="image-container">
                                        <img src={product.imageUrl} alt={product.title} />
                                    </div>
                                    <div className="card-info">
                                        <h3>{product.title}</h3>
                                        <p className="price">${product.price}</p>
                                        <button className="details-btn">VIEW ITEM</button>
                                    </div>
                                </Link>
                                <button
                                    className="details-btn"
                                    onClick={(e) => handleAddToCart(e, {
                                        id: product.id,
                                        title: product.title,
                                        price: product.price,
                                        imageUrl: product.imageUrl,
                                    })}
                                    style={{
                                        margin: '0 1.5rem 1.5rem',
                                        background: addedId === product.id ? 'transparent' : '#e63946',
                                        border: addedId === product.id ? '1px solid #e63946' : '1px solid #e63946',
                                        color: addedId === product.id ? '#e63946' : 'white',
                                        transition: 'all 0.3s ease',
                                    }}
                                >
                                    {addedId === product.id ? '✓ ADDED TO CART' : 'ADD TO CART'}
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: '#666', marginBottom: '20px', fontSize: '1.1rem' }}>
                            No products added yet.
                        </p>
                        <Link
                            to={user ? "/create" : "/login"}
                            onClick={() => window.scrollTo(0, 0)}
                            style={{
                                display: 'inline-block',
                                backgroundColor: '#e63946',
                                color: 'white',
                                padding: '15px 35px',
                                borderRadius: '2px',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                fontSize: '0.9rem',
                                transition: 'opacity 0.3s'
                            }}
                        >
                            BE THE FIRST TO ADD ONE
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}