// Sends a plain-text new-order notification to a Telegram chat.
// No-ops safely if the bot token / chat id secrets aren't configured.
export async function sendOrderToTelegram(env, order) {
    const token = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return;

    const items = (order.items || [])
        .map(it => `• ${it.title}${it.size ? ` (${it.size})` : ''} × ${it.quantity} — $${it.price}`)
        .join('\n');

    const delivery = order.delivery?.method === 'office'
        ? `Econt office: ${order.delivery.officeName}, ${order.delivery.cityName}`
        : `Address: ${order.delivery?.address}, ${order.delivery?.cityName}`;

    const lines = [
        `🛒 NEW ORDER #${order.id}`,
        '',
        `👤 ${order.customer?.name}`,
        `📞 ${order.customer?.phone}`,
        order.customer?.email ? `✉️ ${order.customer.email}` : null,
        '',
        items,
        '',
        `🚚 ${delivery}`,
        `💰 Total: $${Number(order.totalPrice).toFixed(2)} (cash on delivery)`,
    ].filter(l => l !== null);

    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: lines.join('\n') }),
        });
        if (!res.ok) console.error('Telegram notify failed:', res.status, await res.text());
    } catch (err) {
        console.error('Telegram notify error:', err);
    }
}
