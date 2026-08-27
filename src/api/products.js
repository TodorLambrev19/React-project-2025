import { API_BASE } from './base';

async function request(path, options) {
    const res = await fetch(API_BASE + path, { credentials: 'include', ...options });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed: ${res.status}`);
    }
    return res.json();
}

export async function createProduct(productData) {
    return request('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
}

export async function getAllProducts() {
    return request('/api/products');
}

export async function getProductById(id) {
    return request(`/api/products/${id}`);
}

export async function deleteProduct(id) {
    return request(`/api/admin/products/${id}`, { method: 'DELETE' });
}

export async function updateProduct(id, productData) {
    return request(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
    });
}
