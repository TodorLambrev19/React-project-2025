import { API_BASE } from './base';

export async function searchCities(term) {
    const res = await fetch(`${API_BASE}/api/econt/cities?term=${encodeURIComponent(term)}`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return res.json();
}

export async function getAllCities() {
    const res = await fetch(`${API_BASE}/api/econt/cities/all`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return res.json();
}

export async function getOfficeCities() {
    const res = await fetch(`${API_BASE}/api/econt/cities/with-offices`);
    if (!res.ok) throw new Error('Failed to fetch cities');
    return res.json();
}

export async function getOffices(cityId) {
    const res = await fetch(`${API_BASE}/api/econt/offices?cityId=${encodeURIComponent(cityId)}`);
    if (!res.ok) throw new Error('Failed to fetch offices');
    return res.json();
}

export async function searchStreets(cityId, term) {
    const res = await fetch(`${API_BASE}/api/econt/streets?cityId=${encodeURIComponent(cityId)}&term=${encodeURIComponent(term)}`);
    if (!res.ok) throw new Error('Failed to fetch streets');
    return res.json();
}
