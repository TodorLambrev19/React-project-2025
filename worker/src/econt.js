import { json } from './http.js';

const ECONT_BASE = 'https://ee.econt.com/services/Nomenclatures/NomenclaturesService';

async function callEcont(method, body) {
    const res = await fetch(`${ECONT_BASE}.${method}.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Econt ${method} failed: ${res.status}`);
    return res.json();
}

export async function handleCities(url, request, env) {
    const term = (url.searchParams.get('term') || '').trim().toLowerCase();
    if (term.length < 2) return json([], request, env);

    const data = await callEcont('getCities', { countryCode: 'BGR' });
    const matches = (data.cities || [])
        .filter(c => c.name.toLowerCase().includes(term) || c.nameEn?.toLowerCase().includes(term))
        .slice(0, 20)
        .map(c => ({ id: c.id, name: c.name }));

    return json(matches, request, env);
}

export async function handleAllCities(request, env) {
    const cacheKey = new Request('https://cache.internal/econt-all-cities', request);
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const data = await callEcont('getCities', { countryCode: 'BGR' });
    const cities = (data.cities || [])
        .map(c => ({ id: c.id, name: c.name }))
        .sort((a, b) => a.name.localeCompare(b.name, 'bg'));

    const res = json(cities, request, env);
    res.headers.set('Cache-Control', 'public, max-age=86400');
    await cache.put(cacheKey, res.clone());
    return res;
}

export async function handleOfficeCities(request, env) {
    const cacheKey = new Request('https://cache.internal/econt-office-cities', request);
    const cache = caches.default;
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const data = await callEcont('getOffices', { countryCode: 'BGR' });
    const byId = new Map();
    for (const office of data.offices || []) {
        const city = office.address?.city;
        if (city && !byId.has(city.id)) byId.set(city.id, { id: city.id, name: city.name });
    }
    const cities = [...byId.values()].sort((a, b) => a.name.localeCompare(b.name, 'bg'));

    const res = json(cities, request, env);
    res.headers.set('Cache-Control', 'public, max-age=86400');
    await cache.put(cacheKey, res.clone());
    return res;
}

export async function handleOffices(url, request, env) {
    const cityId = Number(url.searchParams.get('cityId'));
    if (!cityId) return json([], request, env);

    const data = await callEcont('getOffices', { cityID: cityId });
    const offices = (data.offices || []).map(o => ({ id: o.id, name: o.name }));

    return json(offices, request, env);
}

export async function handleStreets(url, request, env) {
    const cityId = Number(url.searchParams.get('cityId'));
    const term = (url.searchParams.get('term') || '').trim().toLowerCase();
    if (!cityId || term.length < 2) return json([], request, env);

    const data = await callEcont('getStreets', { cityID: cityId });
    const matches = (data.streets || [])
        .filter(s => s.name.toLowerCase().includes(term))
        .slice(0, 20)
        .map(s => ({ id: s.id, name: s.name }));

    return json(matches, request, env);
}
