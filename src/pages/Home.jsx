import { useEffect, useState } from 'react';
import { getAllProducts } from '../api/products';
import { Link } from 'react-router-dom';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>Loading products...</div>;

    return (
        <div className="home-container">
            <h1>Latest Drops</h1>
            
            {products.length === 0 ? (
                <p>No products yet. Be the first to add one!</p>
            ) : (
                <div className="products-grid">
                    {products.map(product => (
                        <div key={product.id} className="product-card">
                            {/* Снимка на продукта */}
                            <div className="image-container">
                                <img src={product.imageUrl} alt={product.title} />
                            </div>
                            
                            {/* Информация */}
                            <div className="card-info">
                                <h3>{product.title}</h3>
                                <p className="category">{product.category}</p>
                                <p className="price">${product.price}</p>
                                
                                {/* Бутон за детайли (ще го направим после) */}
                                <Link to={`/details/${product.id}`} className="details-btn">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}