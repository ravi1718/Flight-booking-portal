import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useUser } from '@clerk/react';
import { Plane, Clock, MapPin, Wifi, UtensilsCrossed, Tv, ArrowLeft, Shield, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const FlightDetails = () => {
    const navigate = useNavigate();
    const { selectedFlight: flight } = useBooking();
    const { isSignedIn } = useUser();

    if (!flight) {
        return (
            <div className="min-h-screen bg-[#f0f4ff] pt-28 flex items-center justify-center">
                <div className="text-center">
                    <Plane className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">No flight selected</h2>
                    <button onClick={() => navigate('/search')} className="mt-4 text-blue-600 font-semibold hover:underline">Search Flights →</button>
                </div>
            </div>
        );
    }

    const fmt = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fmtDate = (iso) => new Date(iso).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const handleContinue = () => {
        if (!isSignedIn) {
            toast.info('Please sign in to book a flight');
            return;
        }
        navigate(`/book/${flight._id}`);
    };

    return (
        <div className="min-h-screen bg-[#f0f4ff] pt-20 pb-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 font-medium mb-6 mt-4 transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to results</span>
                </button>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-8 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <div className="flex items-center space-x-3 mb-1">
                                    <span className="text-3xl">{flight.logo}</span>
                                    <h2 className="text-2xl font-extrabold">{flight.airline}</h2>
                                </div>
                                <p className="text-blue-200 font-medium">
                                    {flight.flightNumber} &nbsp;·&nbsp; {flight.class}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-blue-200 text-sm">Price per person</p>
                                <p className="text-4xl font-extrabold">₹{flight.price.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Route */}
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                            <div className="text-center md:text-left">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-center md:justify-start mb-1">
                                    <MapPin className="h-3 w-3 mr-1" /> Departure
                                </p>
                                <p className="text-5xl font-extrabold text-gray-900">{fmt(flight.departureTime)}</p>
                                <p className="text-xl font-bold text-blue-700 mt-1">{flight.from.toUpperCase()}</p>
                                <p className="text-sm text-gray-400 mt-1">{fmtDate(flight.departureTime)}</p>
                            </div>

                            <div className="flex flex-col items-center">
                                <div className="bg-blue-50 border border-blue-100 px-5 py-2 rounded-full text-sm font-bold text-blue-700 flex items-center mb-3">
                                    <Clock className="h-4 w-4 mr-2" />{flight.duration}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full border-2 border-blue-400" />
                                    <div className="w-24 md:w-32 h-px bg-blue-300" />
                                    <Plane className="h-5 w-5 text-blue-600" />
                                    <div className="w-24 md:w-32 h-px bg-blue-300" />
                                    <div className="w-3 h-3 rounded-full bg-blue-600" />
                                </div>
                                <p className={`text-sm font-bold mt-3 ${flight.stops === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                    {flight.stops === 0 ? '✓ Non-stop flight' : `${flight.stops} stop(s)`}
                                </p>
                            </div>

                            <div className="text-center md:text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-center md:justify-end mb-1">
                                    <MapPin className="h-3 w-3 mr-1" /> Arrival
                                </p>
                                <p className="text-5xl font-extrabold text-gray-900">{fmt(flight.arrivalTime)}</p>
                                <p className="text-xl font-bold text-blue-700 mt-1">{flight.to.toUpperCase()}</p>
                                <p className="text-sm text-gray-400 mt-1">{fmtDate(flight.arrivalTime)}</p>
                            </div>
                        </div>

                        {/* Amenities */}
                        {flight.amenities?.length > 0 && (
                            <div className="flex flex-wrap gap-3 mb-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="w-full text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Included Amenities</p>
                                {flight.amenities.map(a => (
                                    <span key={a} className="flex items-center space-x-1.5 text-sm text-gray-700 bg-white px-3 py-2 rounded-xl border border-gray-100 font-medium shadow-sm">
                                        {a === 'WiFi' && <Wifi className="h-4 w-4 text-blue-500" />}
                                        {a === 'Meals' && <UtensilsCrossed className="h-4 w-4 text-orange-500" />}
                                        {a === 'Entertainment' && <Tv className="h-4 w-4 text-purple-500" />}
                                        <span>{a}</span>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Fare Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            {[
                                { icon: <Tag className="h-5 w-5 text-green-600" />, title: 'Refundable', desc: 'Partial refund on cancellation' },
                                { icon: <Shield className="h-5 w-5 text-blue-600" />, title: 'Secure', desc: '100% safe payments' },
                                { icon: <Plane className="h-5 w-5 text-purple-600" />, title: 'On-Time', desc: '92% on-time performance' },
                            ].map(item => (
                                <div key={item.title} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="bg-white p-2 rounded-lg shadow-sm">{item.icon}</div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{item.title}</p>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Book CTA */}
                        <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-blue-700 to-blue-900 p-6 rounded-2xl text-white">
                            <div>
                                <p className="text-blue-200 text-sm mb-1">Total for 1 passenger</p>
                                <p className="text-4xl font-extrabold">₹{flight.price.toLocaleString()}</p>
                                <p className="text-blue-200 text-xs mt-1">{flight.seatsAvailable} seats remaining at this price</p>
                            </div>
                            <button
                                onClick={handleContinue}
                                className="mt-4 md:mt-0 bg-white text-blue-700 font-extrabold px-10 py-4 rounded-xl hover:bg-blue-50 shadow-xl transition-all hover:scale-105 text-lg"
                            >
                                Continue to Booking →
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FlightDetails;
