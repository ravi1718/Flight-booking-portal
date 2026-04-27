import { authRequest } from './api';

export async function createBooking(bookingData, getToken) {
    const response = await authRequest('post', '/bookings', getToken, bookingData);
    return response.data;
}

export async function getMyBookings(getToken) {
    const response = await authRequest('get', '/bookings', getToken);
    return response.data;
}

export async function getBookingById(id, getToken) {
    const response = await authRequest('get', `/bookings/${id}`, getToken);
    return response.data;
}

export async function confirmPayment(bookingId, addOns, getToken) {
    const response = await authRequest('put', `/bookings/${bookingId}/pay`, getToken, { addOns: addOns || {} });
    return response.data;
}
