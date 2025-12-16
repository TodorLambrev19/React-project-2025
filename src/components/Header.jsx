import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

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

    return (
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
            marginBottom: '0px'
        }}>
            <div className="logo" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Link to="/" style={{display: 'flex', alignItems: 'center'}}>
                    <img 
                        src="/images/logo-white.png" 
                        alt="VRAG Logo" 
                        style={{ 
                            height: '220px',
                            width: 'auto',
                            objectFit: 'contain'
                        }} 
                    />
                </Link>
            </div>
            <nav style={{
                display: 'flex',
                alignItems: 'center',
                gap: '30px'
            }}>
                <Link to="/" style={navLinkStyle}>HOME</Link>
                <Link to="/about" style={navLinkStyle}>ABOUT</Link>
                {user ? (
                    <>
                        <Link to="/create" style={navLinkStyle}>CREATE</Link>
                        <span style={{ color: '#333', fontSize: '1.5rem', fontWeight: '100' }}>|</span>
                        <span style={{ color: '#888', fontSize: '0.85rem', fontWeight: '500' }}>
                            {user.email}
                        </span>
                        <button
                            onClick={logout}
                            style={{
                                ...navLinkStyle,
                                backgroundColor: '#e63946',
                                border: 'none',
                                padding: '10px 24px',
                                borderRadius: '2px',
                                fontSize: '0.9rem',
                                color: 'white'
                            }}
                        >
                            LOGOUT
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={navLinkStyle}>LOGIN</Link>
                        <Link to="/register" style={{
                            ...navLinkStyle,
                            backgroundColor: '#e63946',
                            padding: '10px 24px', 
                            borderRadius: '2px',
                            fontSize: '0.9rem'
                        }}>
                            REGISTER
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}