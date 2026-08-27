import { json, corsHeaders } from './http.js';
import { handleCities, handleAllCities, handleOfficeCities, handleOffices, handleStreets } from './econt.js';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from './products.js';
import { createOrder, listOrders, updateOrderStatus } from './orders.js';
import { login, logout, checkSession } from './auth.js';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const { pathname } = url;
        const method = request.method;

        if (method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders(request, env) });
        }

        try {
            if (pathname === '/api/login' && method === 'POST') return await login(request, env);
            if (pathname === '/api/logout' && method === 'POST') return logout(request, env);
            if (pathname === '/api/session' && method === 'GET') return await checkSession(request, env);

            if (pathname === '/api/econt/cities' && method === 'GET') return await handleCities(url, request, env);
            if (pathname === '/api/econt/cities/all' && method === 'GET') return await handleAllCities(request, env);
            if (pathname === '/api/econt/cities/with-offices' && method === 'GET') return await handleOfficeCities(request, env);
            if (pathname === '/api/econt/offices' && method === 'GET') return await handleOffices(url, request, env);
            if (pathname === '/api/econt/streets' && method === 'GET') return await handleStreets(url, request, env);

            if (pathname === '/api/products' && method === 'GET') return await listProducts(request, env);
            if (pathname === '/api/admin/products' && method === 'POST') return await createProduct(request, env);

            const productMatch = pathname.match(/^\/api\/(admin\/)?products\/([^/]+)$/);
            if (productMatch) {
                const [, isAdmin, id] = productMatch;
                if (!isAdmin && method === 'GET') return await getProduct(id, request, env);
                if (isAdmin && method === 'PUT') return await updateProduct(id, request, env);
                if (isAdmin && method === 'DELETE') return await deleteProduct(id, request, env);
            }

            if (pathname === '/api/orders' && method === 'POST') return await createOrder(request, env, ctx);
            if (pathname === '/api/admin/orders' && method === 'GET') return await listOrders(request, env);

            const orderMatch = pathname.match(/^\/api\/admin\/orders\/([^/]+)$/);
            if (orderMatch && method === 'PATCH') return await updateOrderStatus(orderMatch[1], request, env);
        } catch (err) {
            return json({ error: err.message }, request, env, 502);
        }

        return json({ error: 'Not found' }, request, env, 404);
    },
};
