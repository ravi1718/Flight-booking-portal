import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/UI/Spinner';
import { Ticket, Plane, Calendar, ExternalLink } from 'lucide-react';
import Button from '../components/UI/Button';

const MyBookings = () => {
    const { user } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get(`http://localhost:5000/api/bookings`, config);
                setBookings(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [user.token]);

    if (loading) return <div className="pt-24"><Spinner /></div>;

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center mb-10">
                    <div className="bg-primary p-3 rounded-xl mr-4"><Ticket className="text-white h-8 w-8" /></div>
                    <h2 className="text-4xl font-bold text-gray-900">My Bookings</h2>
                </div>

                {bookings.length > 0 ? (
                    <div className="grid gap-6">
                        {bookings.map(booking => (
                            <div key={booking._id} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-6 w-full md:w-auto">
                                    <div className="bg-blue-50 p-4 rounded-xl text-primary">
                                        <Plane className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm mb-1 font-medium">Booking Ref #{booking._id.toString().substr(-8).toUpperCase()}</p>
                                        <h3 className="font-bold text-xl text-gray-900">{booking.flight.from} <span className="text-gray-400 font-normal mx-2">-</span> {booking.flight.to}</h3>
                                        <p className="text-gray-600 font-medium mt-1">{booking.flight.airline} • {booking.passengers.length} Passenger{booking.passengers.length > 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col mx-auto md:mx-0 w-full md:w-auto text-center md:text-left my-4 md:my-0">
                                    <div className="flex items-center justify-center md:justify-start text-gray-500 mb-2 font-medium">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {new Date(booking.flight.departureTime).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <div className="font-bold text-3xl text-gray-900 mt-1">
                                        ${booking.totalAmount}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-56 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 pl-0 md:pl-8">
                                    <span className={`px-4 py-3 rounded-xl font-bold text-center text-sm uppercase tracking-wider ${booking.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {booking.paymentStatus}
                                    </span>
                                    {booking.paymentStatus === 'Paid' && (
                                        <Button variant="secondary" className="w-full py-3" onClick={() => navigate(`/confirmation/${booking._id}`)}>
                                            View Ticket <ExternalLink className="h-4 w-4 ml-2" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm mt-8">
                        <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Ticket className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-800 mb-3">No bookings yet</h3>
                        <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Looks like you haven't booked any flights yet. Start planning your next adventure today!</p>
                        <Button onClick={() => navigate('/search')} className="px-10 py-4 text-lg shadow-xl shadow-blue-500/20">Search Flights</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
