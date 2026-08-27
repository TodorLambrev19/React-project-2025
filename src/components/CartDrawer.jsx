import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 200,
          }}
        />
      )}

      <div style={{
        position: 'fixed',
        top: 0, right: 0,
        width: '380px',
        maxWidth: '100vw',
        height: '100vh',
        background: '#0a0a0a',
        borderLeft: '1px solid #222',
        zIndex: 201,
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex',
        flexDirection: 'column',
      }}>

        <div style={{
          padding: '24px',
          borderBottom: '1px solid #1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
        }}>
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'white', whiteSpace: 'nowrap' }}>
            Your Cart ({cartItems.length})
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none',
            color: '#666', fontSize: '1.5rem',
            cursor: 'pointer', lineHeight: 1,
            flexShrink: 0, width: 'auto', marginTop: 0,
          }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#444', marginTop: '4rem' }}>
              <p style={{ fontSize: '1rem', marginBottom: '8px' }}>Your cart is empty</p>
              <p style={{ fontSize: '0.85rem' }}>Add some products to get started</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={`${item.id}-${item.size || ''}`} style={{
                display: 'flex', gap: '16px',
                padding: '16px 0',
                borderBottom: '1px solid #1a1a1a',
              }}>
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '4px' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '4px', textTransform: 'uppercase' }}>
                    {item.title}
                  </p>
                  {item.size && (
                    <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Size: {item.size}
                    </p>
                  )}
                  <p style={{ fontSize: '0.9rem', color: '#e63946', fontWeight: 700, marginBottom: '10px' }}>
                    ${item.price}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      style={{
                        width: 28, height: 28,
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        color: 'white', cursor: 'pointer',
                        borderRadius: '2px', fontSize: '1rem',
                      }}>−</button>
                    <span style={{ color: 'white', minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      style={{
                        width: 28, height: 28,
                        background: '#1a1a1a',
                        border: '1px solid #333',
                        color: 'white', cursor: 'pointer',
                        borderRadius: '2px', fontSize: '1rem',
                      }}>+</button>
                    <button
                      onClick={() => removeFromCart(item.id, item.size)}
                      style={{
                        marginLeft: 'auto',
                        background: 'none', border: 'none',
                        color: '#444', cursor: 'pointer',
                        fontSize: '0.8rem', letterSpacing: '1px',
                        textTransform: 'uppercase',
                      }}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid #1a1a1a' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              marginBottom: '20px',
            }}>
              <span style={{ color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Total</span>
              <span style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              style={{
                width: '100%', padding: '16px',
                background: '#e63946', border: 'none',
                color: 'white', fontWeight: 700,
                fontSize: '0.9rem', letterSpacing: '2px',
                textTransform: 'uppercase', cursor: 'pointer',
                borderRadius: '2px', marginTop: 0,
              }}
            >
              CHECKOUT
            </button>
          </div>
        )}
      </div>
    </>
  );
}