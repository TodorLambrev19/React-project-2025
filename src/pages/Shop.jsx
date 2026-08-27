import ProductGrid from '../components/ProductGrid';

export default function Shop() {
    return (
        <div className="container products-page">
            <h2 className="section-title" style={{ fontSize: 'clamp(2.6rem, 7vw, 4.5rem)', letterSpacing: '4px' }}>SHOP</h2>
            <ProductGrid />
        </div>
    );
}
