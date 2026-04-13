import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/UI/Spinner';
import Button from '../components/UI/Button';
import { toast } from 'react-toastify';
import { CreditCard } from 'lucide-react';

const Payment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get(`http://localhost:5000/api/bookings/${id}`, config);
                setBooking(res.data);
            } catch (error) {
                toast.error('Booking not found');
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id, user.token, navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setVerifying(true);
        setTimeout(async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.put(`http://localhost:5000/api/bookings/${id}/pay`, { paymentIntentId: 'pi_test_' + Math.random().toString(36).substr(2, 9) }, config);
                toast.success('Payment successful!');
                navigate(`/confirmation/${res.data._id}`);
            } catch (error) {
                toast.error('Payment failed. Please try again.');
                setVerifying(false);
            }
        }, 2000);
    };

    if (loading) return <div className="pt-24"><Spinner /></div>;
    if (booking?.paymentStatus === 'Paid') {
        navigate(`/confirmation/${booking._id}`);
        return null;
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-12 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CreditCard className="h-10 w-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Payment</h2>
                    <p className="text-gray-500">Amount to pay</p>
                    <h3 className="text-5xl font-bold text-primary mt-2">${booking.totalAmount}</h3>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Card Number</label>
                        <input
                            type="text"
                            disabled
                            value="**** **** **** 4242"
                            className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Expiry</label>
                            <input
                                type="text"
                                disabled
                                value="12/26"
                                className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">CVC</label>
                            <input
                                type="text"
                                disabled
                                value="***"
                                className="w-full px-5 py-4 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 outline-none"
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={verifying} className="w-full py-4 text-lg mt-4 bg-gray-900 hover:bg-black text-white focus:ring-gray-900">
                        {verifying ? (
                            <span className="flex items-center justify-center"><Spinner /> <span className="ml-2">Processing...</span></span>
                        ) : (
                            `Pay $${booking.totalAmount} Securely`
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
