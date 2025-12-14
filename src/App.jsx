import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Create from './pages/Create'; 
import Details from './pages/Details';
import Edit from './pages/Edit';

const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
      await logout();
      navigate('/'); 
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>VRAG CLOTHING</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        
        {user ? (
          <>
             {}
             <Link to="/create" style={styles.link}>CREATE</Link>
             
             <span style={{color: '#999', margin: '0 10px'}}>| {user.email}</span>
             <button onClick={handleLogout} style={styles.logoutBtn}>LOGOUT</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Navigation />
      
      <main style={{ padding: '2rem' }}>
        {}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/edit/:id" element={<Edit />} />     
          <Route path="/create" element={<Create />} /> 
        </Routes>
      </main>
    </AuthProvider>
  );
}


const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1e1e1e', 
    borderBottom: '1px solid #333',
    position: 'sticky',
    top: 0,
    zIndex: 100
  },
  logo: {
    color: '#e63946',
    fontWeight: 'bold',
    fontSize: '1.5rem',
    letterSpacing: '2px'
  },
  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
    textTransform: 'uppercase'
  },
  logoutBtn: {
    backgroundColor: '#e63946',
    color: 'white',
    border: 'none',
    padding: '5px 15px',
    cursor: 'pointer',
    borderRadius: '4px',
    fontWeight: 'bold'
  }
};

export default App;