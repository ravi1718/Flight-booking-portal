import { api } from './api';

export async function searchFlights(from, to, date) {
    const response = await api.get('/flights', { params: { from, to, date } });
    return response.data;
}

export async function getFlightById(id) {
    const response = await api.get(`/flights/${id}`);
    return response.data;
}
