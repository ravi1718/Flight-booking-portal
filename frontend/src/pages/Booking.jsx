import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useAuth } from '@clerk/react';
import { User, Plane, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createBooking } from '../services/bookingService';

const Booking = () => {
    const navigate = useNavigate();
    const { selectedFlight: flight, saveBooking } = useBooking();
    const { getToken } = useAuth();
    const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'Male' }]);
    const [loading, setLoading] = useState(false);

    if (!flight) {
        return (
            <div className="min-h-screen bg-[#f0f4ff] pt-28 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">No flight selected</h2>
                    <button onClick={() => navigate('/')} className="text-blue-600 font-semibold hover:underline">← Search Flights</button>
                </div>
            </div>
        );
    }

    const fmt = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const totalAmount = flight.price * passengers.length;

    const handleAddPassenger = () => setPassengers([...passengers, { name: '', age: '', gender: 'Male' }]);
    const handleRemove = (i) => { if (passengers.length > 1) setPassengers(passengers.filter((_, idx) => idx !== i)); };
    const handleChange = (i, field, val) => {
        const p = [...passengers]; p[i][field] = val; setPassengers(p);
    };

    const handleBook = async () => {
        for (let p of passengers) {
            if (!p.name.trim() || !p.age) return toast.error('Please fill all passenger details');
        }
        setLoading(true);
        try {
            const createdBooking = await createBooking(
                { flightId: flight._id, passengers, totalAmount },
                getToken
            );
            // Enrich with full flight object for Payment page display
            saveBooking({ ...createdBooking, flight });
            navigate(`/payment/${createdBooking._id}`);
        } catch (err) {
            const msg = err.response?.data?.message || 'Booking failed. Please try again.';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f0f4ff] pt-20 pb-16">
            <div className="container mx-auto px-4 max-w-5xl">
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 font-medium mb-6 mt-4 transition-colors">
                    <ArrowLeft className="h-4 w-4" /><span>Back</span>
                </button>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8 space-x-4">
                    {['Search', 'Select', 'Passengers', 'Payment', 'Confirm'].map((step, i) => (
                        <React.Fragment key={step}>
                            <div className={`flex items-center space-x-2 ${i <= 2 ? 'text-blue-600' : 'text-gray-300'}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i <= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>{i + 1}</div>
                                <span className="text-xs font-semibold hidden md:block">{step}</span>
                            </div>
                            {i < 4 && <div className={`flex-1 h-px max-w-10 ${i < 2 ? 'bg-blue-400' : 'bg-gray-200'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Passenger Details</h2>
                <p className="text-gray-500 mb-8">Enter details exactly as they appear on your ID</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Passenger Forms */}
                    <div className="lg:col-span-2 space-y-5">
                        {passengers.map((p, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                                <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800 flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <User className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <span>Passenger {i + 1}</span>
                                    </h3>
                                    {passengers.length > 1 && (
                                        <button onClick={() => handleRemove(i)} className="flex items-center space-x-1 text-red-400 hover:text-red-600 text-sm font-semibold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                                            <Trash2 className="h-4 w-4" /><span>Remove</span>
                                        </button>
                                    )}
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name (as on passport)</label>
                                        <input type="text" value={p.name} onChange={e => handleChange(i, 'name', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-800 font-medium transition-all"
                                            placeholder="e.g. John Smith" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Age</label>
                                        <input type="number" value={p.age} onChange={e => handleChange(i, 'age', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none text-gray-800 font-medium transition-all"
                                            placeholder="Age" min={1} max={99} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Gender</label>
                                        <select value={p.gender} onChange={e => handleChange(i, 'gender', e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white text-gray-800 font-medium transition-all">
                                            <option>Male</option>
                                            <option>Female</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        <button onClick={handleAddPassenger}
                            className="w-full py-4 border-2 border-dashed border-blue-300 rounded-2xl text-blue-600 font-semibold hover:bg-blue-50 hover:border-blue-400 transition-all flex items-center justify-center space-x-2">
                            <Plus className="h-5 w-5" /><span>Add Another Passenger</span>
                        </button>
                    </div>

                    {/* Summary */}
                    <div>
                        <div className="bg-gray-900 rounded-2xl p-6 text-white sticky top-24">
                            <h3 className="font-bold text-lg mb-5 pb-4 border-b border-gray-700">Booking Summary</h3>

                            <div className="bg-gray-800 rounded-xl p-4 mb-5">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-sm font-bold text-gray-300">{flight.airline}</span>
                                    <span className="text-xs bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded-full font-medium">{flight.flightNumber}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-center">
                                        <p className="text-xl font-extrabold">{fmt(flight.departureTime)}</p>
                                        <p className="text-xs text-gray-400">{flight.from.toUpperCase()}</p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <p className="text-xs text-gray-400">{flight.duration}</p>
                                        <Plane className="h-4 w-4 text-blue-400 my-1" />
                                        <p className="text-xs text-green-400">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xl font-extrabold">{fmt(flight.arrivalTime)}</p>
                                        <p className="text-xs text-gray-400">{flight.to.toUpperCase()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm mb-5">
                                <div className="flex justify-between text-gray-400">
                                    <span>Price per person</span><span className="text-white font-semibold">₹{flight.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Passengers</span><span className="text-white font-semibold">{passengers.length}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Taxes & fees</span><span className="text-green-400 font-semibold">Included</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-700 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Total Amount</span>
                                    <span className="text-3xl font-extrabold">₹{totalAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <button onClick={handleBook} disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2">
                                {loading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Creating Booking...</span></>
                                ) : (
                                    <span>Proceed to Payment →</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
