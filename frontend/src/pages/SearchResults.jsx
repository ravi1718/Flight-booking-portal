import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FlightCard from '../components/FlightCard';
import Spinner from '../components/UI/Spinner';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    const from = searchParams.get('from') || '';
    const to = searchParams.get('to') || '';
    const date = searchParams.get('date') || '';

    useEffect(() => {
        const fetchFlights = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`http://localhost:5000/api/flights?from=${from}&to=${to}&date=${date}`);
                setFlights(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchFlights();
    }, [from, to, date]);

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-primary to-blue-800 text-white">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Search Results</h2>
                        <p className="text-blue-100">
                            {from || 'Anywhere'} to {to || 'Anywhere'} {date && `on ${date}`}
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 font-medium text-blue-100 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md">
                        {flights.length} flights found
                    </div>
                </div>

                {loading ? (
                    <Spinner />
                ) : flights.length > 0 ? (
                    <div className="space-y-4">
                        {flights.map(flight => (
                            <FlightCard key={flight._id} flight={flight} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-4">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">No flights found</h3>
                        <p className="text-gray-500">We couldn't find any flights matching your criteria. Try adjusting your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;
