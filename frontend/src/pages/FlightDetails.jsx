import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../components/UI/Spinner';
import Button from '../components/UI/Button';
import { Plane, Clock, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const FlightDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [flight, setFlight] = useState(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="pt-24"><Spinner /></div>;
    if (!flight) return <div className="pt-24 text-center">Flight not found</div>;

    const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formatDate = (d) => new Date(d).toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    const handleContinue = () => {
        if (!user) {
            toast.info('Please login to book a flight');
            navigate('/login');
        } else {
            navigate(`/book/${flight._id}`);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-blue-800 p-8 text-white flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">{flight.airline}</h2>
                            <p className="opacity-90 flex items-center font-medium">Flight {flight.flightNumber}</p>
                        </div>
                        <Plane className="h-16 w-16 opacity-20" />
                    </div>
                    
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-100 pb-8">
                            <div className="text-center md:text-left w-full md:w-auto">
                                <p className="text-sm text-gray-500 font-medium mb-1 flex items-center justify-center md:justify-start">
                                    <MapPin className="w-4 h-4 mr-1" /> Departure
                                </p>
                                <h3 className="text-4xl font-bold text-gray-900 mb-1">{formatTime(flight.departureTime)}</h3>
                                <p className="text-lg font-bold text-primary">{flight.from}</p>
                                <p className="text-sm text-gray-500 mt-2 font-medium">{formatDate(flight.departureTime)}</p>
                            </div>
                            
                            <div className="flex flex-col items-center px-8 my-8 md:my-0">
                                <div className="bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-sm font-bold flex items-center mb-4">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {flight.duration}
                                </div>
                                <Plane className="h-8 w-8 text-primary rotate-90 md:rotate-0" />
                            </div>

                            <div className="text-center md:text-right w-full md:w-auto">
                                <p className="text-sm text-gray-500 font-medium mb-1 flex items-center justify-center md:justify-end">
                                    <MapPin className="w-4 h-4 mr-1" /> Arrival
                                </p>
                                <h3 className="text-4xl font-bold text-gray-900 mb-1">{formatTime(flight.arrivalTime)}</h3>
                                <p className="text-lg font-bold text-primary">{flight.to}</p>
                                <p className="text-sm text-gray-500 mt-2 font-medium">{formatDate(flight.arrivalTime)}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-8 rounded-2xl border border-gray-100">
                            <div className="text-center md:text-left mb-6 md:mb-0">
                                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-2">Economy Class</p>
                                <h4 className="text-5xl font-bold text-gray-900">${flight.price} <span className="text-lg font-medium text-gray-500">/ person</span></h4>
                            </div>
                            <Button onClick={handleContinue} className="w-full md:w-auto px-10 py-4 text-lg shadow-xl shadow-blue-500/30">
                                Continue to Booking
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlightDetails;
