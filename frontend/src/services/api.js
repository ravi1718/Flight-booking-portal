import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: BASE_URL });

export async function authRequest(method, url, getToken, data = null) {
    const token = await getToken();
    if (!token) throw Object.assign(new Error('Not signed in'), { response: { data: { message: 'Please sign in to continue' } } });
    return api({
        method,
        url,
        headers: { Authorization: `Bearer ${token}` },
        ...(data !== null ? { data } : {})
    });
}
