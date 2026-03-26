import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Header({ onCartClick }) {
    const { user, logout } = useAuth();
    const { totalItems } = useCart();
    const [menuOpen, setMenuOpen] = useState(false);

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

    return (
        <>
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 5%',
                width: '100%',
                background: '#000000',
                position: 'relative',
                borderBottom: '1px solid #222',
                zIndex: 100,
                boxSizing: 'border-box',
                height: '90px',
            }}>
                {/* Logo */}
                <div className="logo" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center' }} onClick={closeMenu}>
                        <img
                            src="/images/logo-white.png"
                            alt="VRAG Logo"
                            style={{ height: '220px', width: 'auto', objectFit: 'contain' }}
                        />
                    </Link>
                </div>

                {/* Desktop nav */}
                <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                    <Link to="/" style={navLinkStyle}>HOME</Link>
                    <Link to="/about" style={navLinkStyle}>ABOUT</Link>
                    {user ? (
                        <>
                            <Link to="/create" style={navLinkStyle}>CREATE</Link>
                            <span style={{ color: '#333', fontSize: '1.5rem' }}>|</span>
                            <span style={{ color: '#888', fontSize: '0.85rem' }}>{user.email}</span>
                            <button
                                onClick={logout}
                                style={{
                                    ...navLinkStyle,
                                    backgroundColor: '#e63946',
                                    border: 'none',
                                    padding: '10px 24px',
                                    borderRadius: '2px',
                                    width: 'auto',
                                    marginTop: 0,
                                }}
                            >LOGOUT</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={navLinkStyle}>LOGIN</Link>
                            <Link to="/register" style={{
                                ...navLinkStyle,
                                backgroundColor: '#e63946',
                                padding: '10px 24px',
                                borderRadius: '2px',
                            }}>REGISTER</Link>
                        </>
                    )}

                    {/* Cart icon */}
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
                </nav>

                {/* Hamburger */}
                <div
                    className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(o => !o)}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </header>

            {/* Mobile menu */}
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <Link to="/" onClick={closeMenu}>HOME</Link>
                <Link to="/about" onClick={closeMenu}>ABOUT</Link>
                {user ? (
                    <>
                        <Link to="/create" onClick={closeMenu}>CREATE</Link>
                        <span className="mobile-email">{user.email}</span>
                        <button onClick={() => { logout(); closeMenu(); }}>LOGOUT</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={closeMenu}>LOGIN</Link>
                        <Link to="/register" onClick={closeMenu}
                            style={{ background: '#e63946', margin: '10px 20px 0', width: 'calc(100% - 40px)', borderRadius: '2px', borderBottom: 'none' }}>
                            REGISTER
                        </Link>
                    </>
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