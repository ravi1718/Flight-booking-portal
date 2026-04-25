import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
    const [selectedFlight, setSelectedFlight] = useState(() => {
        const s = sessionStorage.getItem('selectedFlight');
        return s ? JSON.parse(s) : null;
    });

    const [currentBooking, setCurrentBooking] = useState(() => {
        const s = sessionStorage.getItem('currentBooking');
        return s ? JSON.parse(s) : null;
    });

    const selectFlight = (flight) => {
        setSelectedFlight(flight);
        sessionStorage.setItem('selectedFlight', JSON.stringify(flight));
    };

    const saveBooking = (booking) => {
        setCurrentBooking(booking);
        sessionStorage.setItem('currentBooking', JSON.stringify(booking));
    };

    const clearBooking = () => {
        setSelectedFlight(null);
        setCurrentBooking(null);
        sessionStorage.removeItem('selectedFlight');
        sessionStorage.removeItem('currentBooking');
        localStorage.removeItem('myBookings');
    };

    return (
        <BookingContext.Provider value={{ selectedFlight, currentBooking, selectFlight, saveBooking, clearBooking }}>
            {children}
        </BookingContext.Provider>
    );
};

export const useBooking = () => useContext(BookingContext);
