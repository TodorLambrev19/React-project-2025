import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <div className="hero-wrapper" style={{ backgroundImage: "url('/images/hero-banner1.jpg')" }}>
      <div className="hero-overlay">
        <h1 className="hero-title">SEASON 2025</h1>
        <p className="hero-subtitle">LIMITED EDITION</p>
      </div>
    </div>
  );
}