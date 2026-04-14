import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowLeftRight } from 'lucide-react';

const FlightSearch = () => {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        const searchParams = new URLSearchParams();
        if (from) searchParams.append('from', from);
        if (to) searchParams.append('to', to);
        if (date) searchParams.append('date', date);
        navigate(`/search?${searchParams.toString()}`);
    };

    const handleSwap = () => {
        setFrom(to);
        setTo(from);
    };

    return (
        <div className="search-card w-full max-w-4xl mx-auto p-6 md:p-8">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
                <button className="px-5 py-2 rounded-lg bg-white text-blue-700 font-semibold text-sm shadow-sm">One Way</button>
                <button className="px-5 py-2 rounded-lg text-gray-500 font-medium text-sm hover:text-gray-700 transition-colors">Round Trip</button>
            </div>

            <form onSubmit={handleSearch}>
                <div className="flex flex-col md:flex-row gap-3 items-stretch">
                    {/* From */}
                    <div className="flex-1 relative group">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">From</label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Departure city or airport"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 font-medium text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Swap button */}
                    <div className="flex items-end pb-0.5 justify-center">
                        <button
                            type="button"
                            onClick={handleSwap}
                            className="hidden md:flex w-10 h-10 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-full items-center justify-center text-blue-600 transition-all hover:scale-110 mt-6"
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* To */}
                    <div className="flex-1 relative">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">To</label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Arrival city or airport"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 font-medium text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex-1 relative">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 pointer-events-none" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 font-medium text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                                required
                            />
                        </div>
                    </div>

                    {/* Search Button */}
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105 hover:shadow-blue-500/40 text-sm mt-6"
                        >
                            <Search className="h-4 w-4" />
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FlightSearch;
