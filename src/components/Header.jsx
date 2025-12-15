import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header style={{
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '0 40px', 
            backgroundColor: '#000', 
            borderBottom: 'none', 
            height: '90px', 
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            width: '100%',
            boxSizing: 'border-box'
        }}>

            {}
            <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
                <Link to="/">
                    <img 
                        src="/images/logo-white.png" 
                        alt="VRAG" 
                        style={{
                            height: '235px', 
                            width: 'auto',
                            display: 'block',
                            objectFit: 'contain',
                            marginTop: '14px'
                        }}
                    />
                </Link>
            </div>

            {}
            <nav style={{
                display: 'flex', 
                gap: '30px', 
                alignItems: 'center',
                backgroundColor: 'transparent' 
            }}>
                <Link to="/" style={navLinkStyle}>
                    HOME
                </Link>

                {user ? (
                    <>
                        <Link to="/create" style={navLinkStyle}>
                            CREATE
                        </Link>
                        
                        <span style={{color: '#666', fontSize: '1rem', fontFamily: 'monospace'}}>
                            {user.email}
                        </span>

                        <button onClick={logout} style={logoutButtonStyle}>
                            LOGOUT
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={navLinkStyle}>
                            LOGIN
                        </Link>
                        <Link to="/register" style={logoutButtonStyle}>
                            REGISTER
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
}

const navLinkStyle = {
    color: '#fff', 
    textDecoration: 'none', 
    fontWeight: '800', 
    fontSize: '1.1rem', 
    letterSpacing: '1px',
    transition: 'color 0.3s',
    textTransform: 'uppercase'
};

const logoutButtonStyle = {
    backgroundColor: '#e63946', 
    color: 'white',
    border: 'none',
    padding: '12px 30px', 
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '1rem', 
    letterSpacing: '1px',
    transition: 'background-color 0.3s'
};