import { json } from './http.js';
import { requireAdmin } from './auth.js';

function toProduct(row) {
    let images = [];
    try {
        images = JSON.parse(row.images || '[]');
    } catch {
        images = [];
    }
    return {
        id: String(row.id),
        title: row.title,
        category: row.category,
        imageUrl: row.image_url,
        images,
        price: row.price,
        description: row.description,
        soldOut: !!row.sold_out,
        preOrder: !!row.pre_order,
        createdAt: row.created_at,
    };
}

export async function listProducts(request, env) {
    const { results } = await env.DB
        .prepare('SELECT * FROM products ORDER BY created_at DESC')
        .all();
    return json(results.map(toProduct), request, env);
}

export async function getProduct(id, request, env) {
    const row = await env.DB
        .prepare('SELECT * FROM products WHERE id = ?')
        .bind(id)
        .first();
    if (!row) return json({ error: 'Not found' }, request, env, 404);
    return json(toProduct(row), request, env);
}

export async function createProduct(request, env) {
    const auth = await requireAdmin(request, env);
    if (!auth.ok) return json({ error: auth.error }, request, env, auth.status);

    const body = await request.json();
    if (!body.title || !body.imageUrl || body.price == null) {
        return json({ error: 'title, imageUrl and price are required' }, request, env, 400);
    }

    const { meta } = await env.DB
        .prepare('INSERT INTO products (title, category, image_url, price, description, sold_out, pre_order, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(body.title, body.category || null, body.imageUrl, Number(body.price), body.description || null, body.soldOut ? 1 : 0, body.preOrder ? 1 : 0, JSON.stringify(Array.isArray(body.images) ? body.images : []))
        .run();

    return json({ id: String(meta.last_row_id) }, request, env, 201);
}

export async function updateProduct(id, request, env) {
    const auth = await requireAdmin(request, env);
    if (!auth.ok) return json({ error: auth.error }, request, env, auth.status);

    const body = await request.json();
    await env.DB
        .prepare('UPDATE products SET title = ?, category = ?, image_url = ?, price = ?, description = ?, sold_out = ?, pre_order = ?, images = ? WHERE id = ?')
        .bind(body.title, body.category || null, body.imageUrl, Number(body.price), body.description || null, body.soldOut ? 1 : 0, body.preOrder ? 1 : 0, JSON.stringify(Array.isArray(body.images) ? body.images : []), id)
        .run();

    return json({ ok: true }, request, env);
}

export async function deleteProduct(id, request, env) {
    const auth = await requireAdmin(request, env);
    if (!auth.ok) return json({ error: auth.error }, request, env, auth.status);

    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    return json({ ok: true }, request, env);
}
