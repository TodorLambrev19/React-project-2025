import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import HeroSection from '../components/HeroSection';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // ИЗТЕГЛЯНЕ НА ПРОДУКТИТЕ ОТ FIREBASE
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
            {}
            <HeroSection />
            <div className="hero-separator"></div>

            {}
            <div className="featured-grid">
                <div className="featured-card" style={{ backgroundImage: "url('/images/survive alone.jpg')" }}>
                    <div className="featured-content">
                        <h3>NEW ARRIVALS</h3>
                    </div>
                </div>
                <div className="featured-card" style={{ backgroundImage: "url('/images/Traitor.jpg')" }}>
                    <div className="featured-content">
                        <h3>BEST SELLERS</h3>
                    </div>
                </div>
            </div>

            {}
            <div className="container" style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '4rem 20px', 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h2 className="section-title">ADDED PRODUCTS</h2>

                {loading ? (
                    <p style={{ textAlign: 'center', color: '#888' }}>Loading collection...</p>
                ) : products.length > 0 ? (
                    <div className="premium-grid">
                        {products.map(product => (
                            <div key={product.id} className="premium-card">
                                <Link to={`/details/${product.id}`} className="card-link">
                                    <div className="card-image-box">
                                        <img src={product.imageUrl} alt={product.title} />
                                        <div className="quick-view">VIEW ITEM</div>
                                    </div>
                                    <div className="card-details">
                                        <h3>{product.title}</h3>
                                        <p className="card-price">${product.price}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                        <p style={{ marginBottom: '10px' }}>No products added yet.</p>
                        <Link to="/create" style={{ color: '#e63946', fontWeight: 'bold' }}>ADD FIRST DROP</Link>
                    </div>
                )}
            </div>
        </div>
    );
}