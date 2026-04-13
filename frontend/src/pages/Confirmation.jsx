import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/UI/Spinner';
import Button from '../components/UI/Button';
import { CheckCircle, Download, ArrowRight } from 'lucide-react';

const Confirmation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get(`http://localhost:5000/api/bookings/${id}`, config);
                setBooking(res.data);
            } catch (error) {
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id, user.token, navigate]);

    if (loading) return <div className="pt-24"><Spinner /></div>;

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-12 flex items-center justify-center px-4">
            <div className="max-w-2xl w-full bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-gray-100 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
                <div className="flex justify-center mb-8">
                    <CheckCircle className="h-24 w-24 text-green-500" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
                <p className="text-xl text-gray-600 mb-10">Your e-ticket has been sent to <span className="font-bold text-gray-900">{user.email}</span></p>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left mb-10">
                    <h3 className="font-bold text-gray-800 text-lg mb-4 border-b border-gray-200 pb-3 uppercase tracking-wider">Booking Reference</h3>
                    <div className="flex justify-between items-center bg-white px-6 py-4 rounded-xl border border-gray-100 uppercase tracking-widest font-mono font-bold text-3xl text-primary mb-4 shadow-sm text-center justify-center">
                        {booking?._id?.toString().substr(-8)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-4 text-sm mt-6">
                        <div>
                            <p className="text-gray-500 mb-1 font-medium">Flight Details</p>
                            <p className="font-bold text-gray-900 text-lg">{booking.flight.airline} {booking.flight.flightNumber}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 mb-1 font-medium">Payment Status</p>
                            <p className="font-bold text-green-500 text-lg">{booking.paymentStatus}</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="secondary" className="py-4 px-8 text-lg" onClick={() => window.print()}>
                        <Download className="mr-2 h-5 w-5" /> Download Ticket
                    </Button>
                    <Button onClick={() => navigate('/my-bookings')} className="py-4 px-8 text-lg border-none shadow-xl shadow-blue-500/30">
                        View My Bookings <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;
