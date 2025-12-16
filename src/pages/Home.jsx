import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSection from '../components/HeroSection';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="home-wrapper">
            <HeroSection />
            <div className="static-section">
                <Link to="/details/static-1" className="static-card" onClick={() => window.scrollTo(0, 0)}>
                    <img src="/images/survive alone.jpg" alt="New Arrivals" className="static-image" />
                    <div className="overlay"></div>
                    <div className="static-content">
                        <h3>"SURVIVE ALONE"-T-SHIRT</h3>
                        <p className="static-price">$65.00</p>
                    </div>
                </Link>
                <Link to="/details/static-2" className="static-card" onClick={() => window.scrollTo(0, 0)}>
                    <img src="/images/Traitor.jpg" alt="Best Sellers" className="static-image" />
                    <div className="overlay"></div>
                    <div className="static-content">
                        <h3>"FU*K YOU TRAITOR"-T-Shirt</h3>
                        <p className="static-price">$65.00</p>
                    </div>
                </Link>
                <Link to="/details/static-3" className="static-card" onClick={() => window.scrollTo(0, 0)}>
                    <img src="/images/hat.jpg" alt="Limited Edition" className="static-image" />
                    <div className="overlay"></div>
                    <div className="static-content">
                        <h3>"CRAZY BASTARD"-HAT</h3>
                        <p className="static-price">$10.00</p>
                    </div>
                </Link>
                <Link to="/details/static-4" className="static-card" onClick={() => window.scrollTo(0, 0)}>
                    <img src="/images/long-sleeve.jpg" alt="Accessories" className="static-image" />
                    <div className="overlay"></div>
                    <div className="static-content">
                        <h3>"TARGET COLAB"-LONG SLEEVE</h3>
                        <p className="static-price">$50.00</p>
                    </div>
                </Link>

            </div>
            <div className="container" style={{maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem'}}>
                <h2 className="section-title">ADDED PRODUCTS</h2>

                {loading ? (
                    <p style={{textAlign: 'center', color: '#888'}}>Loading collection...</p>
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
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{textAlign: 'center', padding: '3rem'}}>
                        <p style={{color: '#666', marginBottom: '20px', fontSize: '1.1rem'}}>
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