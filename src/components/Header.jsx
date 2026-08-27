import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAdminSession } from '../hooks/useAdminSession';

export default function Header({ onCartClick }) {
    const { totalItems } = useCart();
    const { isAdmin, logout } = useAdminSession();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navLinkStyle = {
        color: 'white',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '1.5px',
        cursor: 'pointer',
        transition: 'opacity 0.3s'
    };

    const closeMenu = () => setMenuOpen(false);

    const CartButton = (
        <button
            onClick={onCartClick}
            style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                width: 'auto',
                marginTop: 0,
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
                <span style={{
                    position: 'absolute',
                    top: 0, right: 0,
                    background: '#e63946',
                    color: 'white',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    width: '18px', height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>{totalItems}</span>
            )}
        </button>
    );

    return (
        <>
            <header style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                alignItems: 'center',
                padding: '0 5%',
                width: '100%',
                background: 'transparent',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                boxSizing: 'border-box',
                height: '90px',
            }}>
                {/* Left: hamburger (mobile only) */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
                        onClick={() => setMenuOpen(o => !o)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                {/* Center: logo */}
                <div className="logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center' }} onClick={closeMenu}>
                        <img
                            src="/images/v-logo.png"
                            alt="VRAG Logo"
                            style={{ height: '76px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.9))' }}
                        />
                    </Link>
                </div>

                {/* Right: nav + cart (desktop only, mobile nav/cart live in the menu) */}
                <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '30px' }}>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <Link to="/" className="nav-link" style={navLinkStyle}>HOME</Link>
                        <Link to="/shop" className="nav-link" style={navLinkStyle}>SHOP</Link>
                        <Link to="/about" className="nav-link" style={navLinkStyle}>ABOUT</Link>
                        {isAdmin && (
                            <Link to="/orders" className="nav-link" style={navLinkStyle}>ORDERS</Link>
                        )}
                        {isAdmin && (
                            <button
                                onClick={handleLogout}
                                className="nav-link"
                                style={{ ...navLinkStyle, background: 'none', border: 'none', padding: 0, width: 'auto', marginTop: 0, color: '#888' }}
                            >
                                LOGOUT
                            </button>
                        )}
                    </nav>
                    {CartButton}
                </div>
            </header>

            {/* Mobile menu */}
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <Link to="/" onClick={closeMenu}>HOME</Link>
                <Link to="/shop" onClick={closeMenu}>SHOP</Link>
                <Link to="/about" onClick={closeMenu}>ABOUT</Link>
                {isAdmin && (
                    <Link to="/orders" onClick={closeMenu}>ORDERS</Link>
                )}
                {isAdmin && (
                    <button
                        onClick={() => { handleLogout(); closeMenu(); }}
                        style={{ background: 'none', border: 'none', color: '#888', padding: '14px 20px', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid #111', width: '100%', textAlign: 'center', cursor: 'pointer' }}
                    >
                        LOGOUT
                    </button>
                )}
                <button
                    onClick={() => { onCartClick(); closeMenu(); }}
                    style={{ background: 'none', border: 'none', color: 'white', padding: '14px 20px', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '1px solid #111', width: '100%', textAlign: 'center', cursor: 'pointer' }}
                >
                    CART {totalItems > 0 && `(${totalItems})`}
                </button>
            </div>
        </>
    );
}
