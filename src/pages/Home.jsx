import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';

export default function Home() {
    return (
        <div className="home-wrapper">
            <HeroSection />

            <div className="container products-page">
                <h2 className="section-title">NEW DROPS</h2>
                <ProductGrid limit={4} />
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <Link
                        to="/shop"
                        className="details-btn"
                        style={{
                            display: 'inline-block',
                            padding: '15px 40px',
                            textDecoration: 'none',
                        }}
                    >
                        View Full Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}
