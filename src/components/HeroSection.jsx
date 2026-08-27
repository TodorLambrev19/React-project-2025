import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts } from '../api/products';

export default function HeroSection() {
  const [preOrderId, setPreOrderId] = useState(null);

  useEffect(() => {
    getAllProducts()
      .then(products => {
        const drop = products.find(p => p.preOrder && !p.soldOut);
        if (drop) setPreOrderId(drop.id);
      })
      .catch(err => console.error('Failed to load pre-order product:', err));
  }, []);

  return (
    <div className="hero-wrapper">
      <div className="hero-bg" style={{ backgroundImage: "url('/images/sitebanner.png')" }} />
      <div className="hero-scrim" />
      <Link to={preOrderId ? `/details/${preOrderId}` : '/shop'} className="hero-preorder-btn">
        Pre Order Now
      </Link>
    </div>
  );
}
