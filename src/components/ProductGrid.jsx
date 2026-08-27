import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../api/products';
import { useAdminSession } from '../hooks/useAdminSession';

export default function ProductGrid({ limit }) {
    const { isAdmin } = useAdminSession();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleIds, setVisibleIds] = useState(() => new Set());
    const cardRefs = useRef(new Map());

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsData = await getAllProducts();
                setProducts(productsData);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length === 0) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.dataset.id;
                    setVisibleIds(prev => (prev.has(id) ? prev : new Set(prev).add(id)));
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        cardRefs.current.forEach(el => el && observer.observe(el));
        return () => observer.disconnect();
    }, [products, limit]);

    if (loading) {
        return <p style={{ textAlign: 'center', color: '#888' }}>Loading collection...</p>;
    }

    if (products.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#666', marginBottom: '20px', fontSize: '1.1rem' }}>
                    {isAdmin ? 'No products added yet.' : 'New drops coming soon.'}
                </p>
                {isAdmin && (
                    <Link
                        to="/create"
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
                        ADD YOUR FIRST PRODUCT
                    </Link>
                )}
            </div>
        );
    }

    const visible = limit ? products.slice(0, limit) : products;

    return (
        <div className="products-grid">
            {visible.map((product, i) => (
                <div
                    key={product.id}
                    data-id={product.id}
                    ref={(el) => {
                        if (el) cardRefs.current.set(product.id, el);
                        else cardRefs.current.delete(product.id);
                    }}
                    className={`reveal ${visibleIds.has(product.id) ? 'reveal-visible' : ''}`}
                    style={{ transitionDelay: `${Math.min(i, 6) * 70}ms` }}
                >
                    <div className="product-card">
                        <Link to={`/details/${product.id}`} className="card-link">
                            <div className="image-container">
                                <img
                                    src={product.imageUrl}
                                    alt={product.title}
                                    style={product.soldOut ? { opacity: 0.35 } : undefined}
                                />
                                {product.soldOut ? (
                                    <div className="sold-out-overlay">
                                        <span>SOLD OUT</span>
                                    </div>
                                ) : (
                                    <>
                                        {product.preOrder && (
                                            <span className="pre-order-badge">PRE-ORDER</span>
                                        )}
                                        <div className="card-hover-overlay">
                                            <span className="view-cta">View Item</span>
                                        </div>
                                        <span className="quick-add-icon" aria-hidden="true">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                                                <line x1="3" y1="6" x2="21" y2="6"/>
                                                <path d="M16 10a4 4 0 01-8 0"/>
                                            </svg>
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="card-info">
                                {product.category && <p className="category">{product.category}</p>}
                                <div className="card-row">
                                    <h3>{product.title}</h3>
                                    <p className="price">${product.price}</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
