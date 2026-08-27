import { json } from './http.js';

const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function timingSafeEqual(a, b) {
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

async function hmac(secret, message) {
    const key = await crypto.subtle.importKey(
        'raw', new TextEncoder().encode(secret),
        { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    );
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
    return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/[+/=]/g, c => ({ '+': '-', '/': '_', '=': '' }[c]));
}

async function createSessionCookie(request, env) {
    const secure = new URL(request.url).protocol === 'https:' ? ' Secure;' : '';
    const expires = Date.now() + SESSION_TTL_SECONDS * 1000;
    const payload = `admin.${expires}`;
    const signature = await hmac(env.SESSION_SECRET, payload);
    const value = `${payload}.${signature}`;
    return `${SESSION_COOKIE}=${value}; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=${SESSION_TTL_SECONDS}`;
}

function clearSessionCookie(request) {
    const secure = new URL(request.url).protocol === 'https:' ? ' Secure;' : '';
    return `${SESSION_COOKIE}=; HttpOnly;${secure} SameSite=Strict; Path=/; Max-Age=0`;
}

function getCookie(request, name) {
    const cookie = request.headers.get('Cookie') || '';
    const match = cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? match[1] : null;
}

async function hasValidSession(request, env) {
    const value = getCookie(request, SESSION_COOKIE);
    if (!value) return false;

    const lastDot = value.lastIndexOf('.');
    if (lastDot === -1) return false;
    const payload = value.slice(0, lastDot);
    const signature = value.slice(lastDot + 1);

    const expected = await hmac(env.SESSION_SECRET, payload);
    if (!timingSafeEqual(signature, expected)) return false;

    const [, expiresStr] = payload.split('.');
    return Number(expiresStr) > Date.now();
}

export async function login(request, env) {
    const { password } = await request.json();
    if (typeof password !== 'string' || !timingSafeEqual(password, env.ADMIN_PASSWORD)) {
        return json({ error: 'Invalid password' }, request, env, 401);
    }

    const res = json({ ok: true }, request, env);
    res.headers.append('Set-Cookie', await createSessionCookie(request, env));
    return res;
}

export function logout(request, env) {
    const res = json({ ok: true }, request, env);
    res.headers.append('Set-Cookie', clearSessionCookie(request));
    return res;
}

export async function checkSession(request, env) {
    if (await hasValidSession(request, env)) return json({ authenticated: true }, request, env);
    return json({ authenticated: false }, request, env, 401);
}

export async function requireAdmin(request, env) {
    if (!env.SESSION_SECRET || !env.ADMIN_PASSWORD) {
        return { ok: false, status: 503, error: 'Admin auth not configured yet' };
    }
    if (!(await hasValidSession(request, env))) {
        return { ok: false, status: 401, error: 'Not authenticated' };
    }
    return { ok: true };
}
