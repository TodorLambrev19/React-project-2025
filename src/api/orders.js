import { API_BASE } from './base';

async function request(path, options) {
    const res = await fetch(API_BASE + path, { credentials: 'include', ...options });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return res.json();
}

export async function createOrder(orderData) {
    const { id } = await request('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    return id;
}

export async function getAllOrders() {
    return request('/api/admin/orders');
}

export async function updateOrderStatus(id, status) {
    return request(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
    });
}
