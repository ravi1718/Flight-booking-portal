import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/UI/Spinner';
import Button from '../components/UI/Button';
import { toast } from 'react-toastify';
import { User, Users } from 'lucide-react';

const Booking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [flight, setFlight] = useState(null);
    const [passengers, setPassengers] = useState([{ name: '', age: '', gender: 'Male' }]);
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        const fetchFlight = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/flights/${id}`);
                setFlight(res.data);
            } catch (error) {
                toast.error('Failed to load flight details');
            } finally {
                setLoading(false);
            }
        };
        fetchFlight();
    }, [id]);

    const handleAddPassenger = () => {
        setPassengers([...passengers, { name: '', age: '', gender: 'Male' }]);
    };

    const handlePassengerChange = (index, field, value) => {
        const newPassengers = [...passengers];
        newPassengers[index][field] = value;
        setPassengers(newPassengers);
    };

    const handleRemovePassenger = (index) => {
        if (passengers.length > 1) {
            const newPassengers = passengers.filter((_, i) => i !== index);
            setPassengers(newPassengers);
        }
    };

    const handleBook = async () => {
        for (let p of passengers) {
            if (!p.name || !p.age) {
                return toast.error('Please fill all passenger details');
            }
        }
        setBookingLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const totalAmount = flight.price * passengers.length;
            const res = await axios.post('http://localhost:5000/api/bookings', {
                flightId: flight._id,
                passengers,
                totalAmount
            }, config);
            navigate(`/payment/${res.data._id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally {
            setBookingLoading(false);
        }
    };

    if (loading) return <div className="pt-24"><Spinner /></div>;
    if (!flight) return <div className="pt-24 text-center">Flight not found</div>;

    const totalAmount = flight.price * passengers.length;

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-10">
                    <h2 className="text-4xl font-bold text-gray-900 mb-3">Passenger Details</h2>
                    <p className="text-gray-500 text-lg">Enter details for all passengers traveling</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        {passengers.map((p, index) => (
                            <div key={index} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                    <h3 className="text-xl font-bold flex items-center text-gray-800">
                                        <div className="bg-blue-50 p-2 rounded-lg mr-3 text-primary"><User className="h-5 w-5" /></div> 
                                        Passenger {index + 1}
                                    </h3>
                                    {passengers.length > 1 && (
                                        <button onClick={() => handleRemovePassenger(index)} className="text-red-500 text-sm font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors">
                                            Remove
                                        </button>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            value={p.name}
                                            onChange={(e) => handlePassengerChange(index, 'name', e.target.value)}
                                            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="As per passport"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Age</label>
                                        <input
                                            type="number"
                                            value={p.age}
                                            onChange={(e) => handlePassengerChange(index, 'age', e.target.value)}
                                            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="Age"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                                        <select
                                            value={p.gender}
                                            onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                                            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white transition-all"
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <Button variant="secondary" onClick={handleAddPassenger} className="w-full py-5 border-dashed border-2 text-lg">
                            <Users className="h-6 w-6 mr-2" /> Add Another Passenger
                        </Button>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gray-900 p-8 rounded-3xl shadow-xl text-white sticky top-28">
                            <h3 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-4">Booking Summary</h3>
                            <div className="space-y-4 mb-8 text-gray-300">
                                <div className="flex justify-between items-center">
                                    <span>Flight</span>
                                    <span className="font-bold text-white bg-white/10 px-3 py-1 rounded-lg">{flight.airline}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Route</span>
                                    <span className="font-bold text-white text-right">{flight.from} <br/><span className="text-gray-400 text-sm">to</span><br/> {flight.to}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Passengers</span>
                                    <span className="font-bold text-white">{passengers.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Price p.p</span>
                                    <span className="font-bold text-white">${flight.price}</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-700 pt-6 mb-8">
                                <div className="flex flex-col">
                                    <span className="text-gray-400 text-sm mb-1 uppercase font-bold tracking-wider">Total Amount</span>
                                    <span className="text-5xl font-bold text-white">${totalAmount}</span>
                                </div>
                            </div>
                            <Button onClick={handleBook} disabled={bookingLoading} className="w-full py-4 text-lg bg-primary hover:bg-blue-600 text-white border-none shadow-xl shadow-blue-500/20">
                                {bookingLoading ? 'Processing...' : 'Proceed to Payment'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
