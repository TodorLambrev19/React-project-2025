import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Create from './pages/Create';
import Details from './pages/Details';
import Edit from './pages/Edit';
import About from './pages/About';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        
        <Header /> {}

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<Create />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        <Footer /> {}
      
      </div>
    </AuthProvider>
  );
}

export default App;