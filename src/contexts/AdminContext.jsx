import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { API_BASE } from '../api/base';

const AdminContext = createContext();

export function AdminProvider({ children }) {
    const [status, setStatus] = useState('checking');

    const refresh = useCallback(() => {
        return fetch(`${API_BASE}/api/session`, { credentials: 'include' })
            .then(res => setStatus(res.ok ? 'authenticated' : 'unauthenticated'))
            .catch(() => setStatus('unauthenticated'));
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const login = useCallback(async (password) => {
        const res = await fetch(`${API_BASE}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ password }),
        });
        if (!res.ok) throw new Error('Invalid password');
        setStatus('authenticated');
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch(`${API_BASE}/api/logout`, { method: 'POST', credentials: 'include' });
        } finally {
            setStatus('unauthenticated');
        }
    }, []);

    return (
        <AdminContext.Provider value={{ status, isAdmin: status === 'authenticated', login, logout, refresh }}>
            {children}
        </AdminContext.Provider>
    );
}

export const useAdminSession = () => useContext(AdminContext);
