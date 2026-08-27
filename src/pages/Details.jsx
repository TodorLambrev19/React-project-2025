import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, deleteProduct } from '../api/products';
import { useCart } from '../contexts/CartContext';
import { useAdminSession } from '../hooks/useAdminSession';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function Details() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { isAdmin } = useAdminSession();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [sizeError, setSizeError] = useState(false);
    const carouselRef = useRef(null);

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

    // Reset the gallery to the first photo whenever the product changes
    useEffect(() => {
        setActiveIndex(0);
        if (carouselRef.current) carouselRef.current.scrollLeft = 0;
    }, [id]);

    const gallery = product
        ? [product.imageUrl, ...(product.images || [])].filter((src, index, arr) => src && arr.indexOf(src) === index)
        : [];

    const handleCarouselScroll = () => {
        const el = carouselRef.current;
        if (!el) return;
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        setActiveIndex(prev => (prev === idx ? prev : idx));
    };

    const scrollToIndex = (i) => {
        const el = carouselRef.current;
        if (!el) return;
        el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    };

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
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        addToCart({
            id: id,
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            size: selectedSize,
        });
        navigate('/checkout');
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading details...</div>;
    if (!product) return <div style={{ textAlign: 'center', color: 'white' }}>Product not found!</div>;

    return (
        <>
            <style>{`
                .details-layout {
                    display: flex;
                    gap: 4rem;
                    align-items: flex-start;
                }
                .gallery-carousel {
                    display: flex;
                    overflow-x: auto;
                    scroll-snap-type: x mandatory;
                    -webkit-overflow-scrolling: touch;
                    border-radius: 8px;
                    border: 1px solid #333;
                    scrollbar-width: none;
                }
                .gallery-carousel::-webkit-scrollbar { display: none; }
                .gallery-slide {
                    flex: 0 0 100%;
                    width: 100%;
                    aspect-ratio: 4 / 5;
                    object-fit: cover;
                    scroll-snap-align: center;
                    display: block;
                    user-select: none;
                }
                .gallery-dots {
                    display: none;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 12px;
                }
                .gallery-dot {
                    width: 8px;
                    height: 8px;
                    padding: 0;
                    margin: 0;
                    border-radius: 50%;
                    border: none;
                    background: #444;
                    cursor: pointer;
                    transition: background 0.25s ease, transform 0.25s ease;
                }
                .gallery-dot.active {
                    background: #e63946;
                    transform: scale(1.3);
                }
                .gallery-thumbs {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                .gallery-thumb {
                    width: 70px;
                    height: 70px;
                    padding: 0;
                    margin: 0;
                    flex: none;
                    border-radius: 4px;
                    overflow: hidden;
                    border: 1px solid #333;
                    cursor: pointer;
                    background: none;
                }
                .gallery-thumb.active {
                    border: 2px solid #e63946;
                }
                .gallery-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    display: block;
                }
                @media (max-width: 768px) {
                    .details-layout {
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .details-actions {
                        flex-direction: row;
                    }
                    .gallery-dots { display: flex; }
                    .gallery-thumbs { display: none; }
                }
            `}</style>

            <div className="form-container" style={{
                maxWidth: '1000px',
                textAlign: 'left',
                margin: '4rem auto',
                padding: '2rem',
            }}>
                <div className="details-layout">
                    {/* Image gallery — swipeable carousel on mobile, tap thumbnails on desktop */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        <div
                            ref={carouselRef}
                            onScroll={handleCarouselScroll}
                            className="gallery-carousel"
                            style={{ opacity: product.soldOut ? 0.4 : 1 }}
                        >
                            {gallery.map((src, i) => (
                                <img
                                    key={i}
                                    className="gallery-slide"
                                    src={src}
                                    alt={`${product.title} ${i + 1}`}
                                    draggable={false}
                                />
                            ))}
                        </div>

                        {gallery.length > 1 && (
                            <div className="gallery-dots">
                                {gallery.map((_, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => scrollToIndex(i)}
                                        className={`gallery-dot ${i === activeIndex ? 'active' : ''}`}
                                        aria-label={`Go to photo ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {gallery.length > 1 && (
                            <div className="gallery-thumbs">
                                {gallery.map((src, i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => scrollToIndex(i)}
                                        className={`gallery-thumb ${i === activeIndex ? 'active' : ''}`}
                                    >
                                        <img src={src} alt={`${product.title} ${i + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {product.preOrder && !product.soldOut && (
                            <span style={{
                                alignSelf: 'flex-start',
                                background: 'rgba(230,57,70,0.12)',
                                border: '1px solid #e63946',
                                color: '#e63946',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                padding: '5px 12px',
                                borderRadius: '2px',
                                marginBottom: '12px',
                            }}>
                                Pre-Order
                            </span>
                        )}
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

                        {/* Size picker */}
                        {!product.soldOut && (
                            <div style={{ marginBottom: '20px' }}>
                                <span style={{ display: 'block', color: '#888', fontSize: '0.8rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
                                    Size {sizeError && <span style={{ color: '#e63946' }}>— please select a size</span>}
                                </span>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {SIZES.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => { setSelectedSize(size); setSizeError(false); }}
                                            style={{
                                                width: '48px',
                                                height: '48px',
                                                padding: 0,
                                                margin: 0,
                                                flex: 'none',
                                                background: selectedSize === size ? '#e63946' : 'transparent',
                                                border: selectedSize === size ? '1px solid #e63946' : '1px solid #444',
                                                color: selectedSize === size ? 'white' : '#ccc',
                                                fontWeight: 700,
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                borderRadius: '2px',
                                                transition: 'all 0.2s ease',
                                            }}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={product.soldOut}
                            style={{
                                width: '100%',
                                padding: '16px',
                                background: product.soldOut ? 'transparent' : '#e63946',
                                border: product.soldOut ? '1px solid #444' : 'none',
                                color: product.soldOut ? '#444' : 'white',
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                letterSpacing: '2px',
                                textTransform: 'uppercase',
                                cursor: product.soldOut ? 'not-allowed' : 'pointer',
                                borderRadius: '2px',
                                marginBottom: '12px',
                                transition: 'all 0.3s ease',
                                marginTop: 0,
                            }}
                        >
                            {product.soldOut
                                ? 'SOLD OUT'
                                : (product.preOrder ? 'PRE ORDER NOW' : 'ADD TO CART')}
                        </button>

                        {product.preOrder && !product.soldOut && (
                            <p style={{ color: '#888', fontSize: '0.78rem', marginBottom: '12px', marginTop: '-4px' }}>
                                Pre-order now — ships when the drop launches.
                            </p>
                        )}

                        {isAdmin && (
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