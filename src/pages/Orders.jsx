import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders, updateOrderStatus } from '../api/orders';
import { useAdminSession } from '../hooks/useAdminSession';

const STATUSES = ['pending', 'shipped', 'delivered', 'cancelled'];

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { logout } = useAdminSession();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await getAllOrders();
                setOrders(data);
            } catch (error) {
                console.error('Failed to load orders:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    const handleStatusChange = async (id, status) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        try {
            await updateOrderStatus(id, status);
        } catch (error) {
            console.error('Failed to update order status:', error);
        }
    };

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: 'white' }}>Loading orders...</div>;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'white', textTransform: 'uppercase', margin: 0 }}>
                    Orders
                </h2>
                <button
                    onClick={handleLogout}
                    style={{ background: 'none', border: '1px solid #333', color: '#888', padding: '8px 16px', cursor: 'pointer', textTransform: 'uppercase', fontSize: '0.8rem', width: 'auto', marginTop: 0 }}
                >
                    Logout
                </button>
            </div>

            {orders.length === 0 ? (
                <p style={{ color: '#888' }}>No orders yet.</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} style={{
                        border: '1px solid #222', borderRadius: '4px',
                        padding: '20px', marginBottom: '16px', color: '#ccc',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <strong style={{ color: 'white' }}>{order.customer?.name}</strong>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                style={{ background: '#111', color: 'white', border: '1px solid #333', padding: '4px 8px', width: 'auto' }}
                            >
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <p style={{ margin: '4px 0' }}>Phone: {order.customer?.phone}</p>
                        {order.customer?.email && <p style={{ margin: '4px 0' }}>Email: {order.customer.email}</p>}
                        <p style={{ margin: '4px 0' }}>
                            Delivery: {order.delivery?.method === 'office'
                                ? `Econt office — ${order.delivery.officeName}, ${order.delivery.cityName}`
                                : `Address — ${order.delivery?.address}, ${order.delivery?.cityName}`}
                        </p>
                        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                            {order.items?.map((item, i) => (
                                <li key={i}>{item.title}{item.size ? ` (${item.size})` : ''} × {item.quantity} — ${item.price}</li>
                            ))}
                        </ul>
                        <p style={{ margin: '4px 0', color: 'white', fontWeight: 700 }}>
                            Total to collect: ${Number(order.totalPrice).toFixed(2)}
                        </p>
                    </div>
                ))
            )}
        </div>
    );
}
