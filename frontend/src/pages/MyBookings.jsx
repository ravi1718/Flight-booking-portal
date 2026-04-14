import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { Ticket, Plane, Calendar, ExternalLink, ArrowRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const MyBookings = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [bookings] = useState(() => {
        const all = JSON.parse(localStorage.getItem('myBookings') || '[]');
        return all;
    });

    const fmt = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fmtDate = (iso) => new Date(iso).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div className="min-h-screen bg-[#f0f4ff] pt-20 pb-16">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="flex items-center justify-between mt-6 mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900">My Bookings</h2>
                        <p className="text-gray-500 mt-1">Welcome back, {user?.firstName || 'Traveler'} ✈️</p>
                    </div>
                    <button
                        onClick={() => navigate('/search')}
                        className="flex items-center space-x-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all hover:scale-105 text-sm"
                    >
                        <Search className="h-4 w-4" /><span>Book Another</span>
                    </button>
                </div>

                {bookings.length > 0 ? (
                    <div className="space-y-5">
                        {bookings.map((booking, idx) => (
                            <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.07 }}
                                className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:shadow-card-hover hover:border-blue-100 transition-all duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center gap-5">
                                        {/* Airline Logo */}
                                        <div className="flex items-center space-x-3 md:w-56">
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                                                {booking.flight.logo}
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-gray-900">{booking.flight.airline}</p>
                                                <p className="text-xs text-gray-400">{booking.flight.flightNumber} · {booking.flight.class}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Ref: <span className="font-mono font-bold text-blue-600">{booking._id}</span></p>
                                            </div>
                                        </div>

                                        {/* Route */}
                                        <div className="flex items-center flex-1 gap-3">
                                            <div className="text-center">
                                                <p className="text-xl font-extrabold text-gray-900">{fmt(booking.flight.departureTime)}</p>
                                                <p className="text-sm font-bold text-blue-700">{booking.flight.from.toUpperCase()}</p>
                                            </div>
                                            <div className="flex-1 flex flex-col items-center px-2">
                                                <p className="text-xs text-gray-400 mb-1">{booking.flight.duration}</p>
                                                <div className="w-full flex items-center">
                                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                                    <div className="flex-1 h-px bg-blue-300" />
                                                    <Plane className="h-3.5 w-3.5 text-blue-600 mx-1" />
                                                    <div className="flex-1 h-px bg-blue-300" />
                                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                                </div>
                                                <p className={`text-xs mt-1 font-semibold ${booking.flight.stops === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                                    {booking.flight.stops === 0 ? 'Non-stop' : '1 Stop'}
                                                </p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xl font-extrabold text-gray-900">{fmt(booking.flight.arrivalTime)}</p>
                                                <p className="text-sm font-bold text-blue-700">{booking.flight.to.toUpperCase()}</p>
                                            </div>
                                        </div>

                                        {/* Passengers & Amount */}
                                        <div className="flex items-center gap-4 md:border-l md:border-gray-100 md:pl-5">
                                            <div className="text-center">
                                                <p className="text-xs text-gray-400 font-medium">{booking.passengers.length} Pax</p>
                                                <p className="text-xl font-extrabold text-gray-900">₹{booking.totalAmount.toLocaleString()}</p>
                                                <div className="flex items-center text-gray-400 text-xs mt-1">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {fmtDate(booking.flight.departureTime)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status + Action */}
                                        <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                booking.paymentStatus === 'Paid'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {booking.paymentStatus}
                                            </span>
                                            <button
                                                onClick={() => navigate(`/confirmation/${booking._id}`)}
                                                className="flex items-center space-x-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
                                            >
                                                <span>View Ticket</span><ExternalLink className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-28 bg-white rounded-3xl border border-gray-100 shadow-card">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Ticket className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-3">No bookings yet</h3>
                        <p className="text-gray-400 max-w-sm mx-auto mb-8">Looks like you haven't booked any flights yet. Start planning your next adventure!</p>
                        <button
                            onClick={() => navigate('/search')}
                            className="inline-flex items-center space-x-2 bg-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all hover:scale-105"
                        >
                            <Search className="h-5 w-5" /><span>Search Flights</span><ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
