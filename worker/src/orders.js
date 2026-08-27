import { json } from './http.js';
import { requireAdmin } from './auth.js';
import { sendOrderToTelegram } from './telegram.js';

function toOrder(row) {
    return {
        id: String(row.id),
        items: JSON.parse(row.items),
        totalPrice: row.total_price,
        customer: { name: row.customer_name, phone: row.customer_phone, email: row.customer_email },
        delivery: row.delivery_method === 'office'
            ? { method: 'office', cityName: row.delivery_city_name, officeId: row.delivery_office_id, officeName: row.delivery_office_name }
            : { method: 'address', cityName: row.delivery_city_name, address: row.delivery_address },
        status: row.status,
        createdAt: row.created_at,
    };
}

export async function createOrder(request, env, ctx) {
    const body = await request.json();
    if (!body.items?.length || !body.customer?.name || !body.customer?.phone || !body.delivery?.method) {
        return json({ error: 'items, customer and delivery are required' }, request, env, 400);
    }

    const { meta } = await env.DB
        .prepare(`INSERT INTO orders
            (items, total_price, customer_name, customer_phone, customer_email, delivery_method, delivery_city_name, delivery_office_id, delivery_office_name, delivery_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(
            JSON.stringify(body.items),
            Number(body.totalPrice),
            body.customer.name,
            body.customer.phone,
            body.customer.email || null,
            body.delivery.method,
            body.delivery.cityName || null,
            body.delivery.officeId || null,
            body.delivery.officeName || null,
            body.delivery.address || null,
        )
        .run();

    const id = String(meta.last_row_id);

    // Notify the shop owner over Telegram without blocking the customer's response.
    const notify = sendOrderToTelegram(env, { id, ...body });
    if (ctx?.waitUntil) ctx.waitUntil(notify);
    else await notify;

    return json({ id }, request, env, 201);
}

export async function listOrders(request, env) {
    const auth = await requireAdmin(request, env);
    if (!auth.ok) return json({ error: auth.error }, request, env, auth.status);

    const { results } = await env.DB
        .prepare('SELECT * FROM orders ORDER BY created_at DESC')
        .all();
    return json(results.map(toOrder), request, env);
}

export async function updateOrderStatus(id, request, env) {
    const auth = await requireAdmin(request, env);
    if (!auth.ok) return json({ error: auth.error }, request, env, auth.status);

    const body = await request.json();
    await env.DB
        .prepare('UPDATE orders SET status = ? WHERE id = ?')
        .bind(body.status, id)
        .run();

    return json({ ok: true }, request, env);
}
