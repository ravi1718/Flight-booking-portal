import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, ArrowLeftRight } from 'lucide-react';
import AIRPORTS from '../utils/airports';

const FlightSearch = () => {
    const [tripType, setTripType] = useState('one-way');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [date, setDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const navigate = useNavigate();

    const extractCode = (val) => {
        const match = val.match(/\(([A-Z]{3})\)/);
        if (match) return match[1];
        if (/^[A-Z]{3}$/.test(val.trim())) return val.trim();
        const airport = AIRPORTS.find(a =>
            a.city.toLowerCase() === val.trim().toLowerCase() ||
            a.value.toLowerCase() === val.trim().toLowerCase()
        );
        return airport ? airport.value : val.trim().toUpperCase();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const fromCode = extractCode(from);
        const toCode = extractCode(to);
        const params = { from: fromCode, to: toCode, date, tripType };
        if (tripType === 'round-trip' && returnDate) params.returnDate = returnDate;
        navigate(`/search?${new URLSearchParams(params).toString()}`);
    };

    const handleSwap = () => { setFrom(to); setTo(from); };

    const today = new Date().toISOString().split('T')[0];
    const isRoundTrip = tripType === 'round-trip';

    return (
        <div className="search-card w-full max-w-4xl mx-auto p-6 md:p-8">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
                <button
                    type="button"
                    onClick={() => setTripType('one-way')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${!isRoundTrip ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >One Way</button>
                <button
                    type="button"
                    onClick={() => setTripType('round-trip')}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${isRoundTrip ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >Round Trip</button>
            </div>

            <form onSubmit={handleSearch}>
                <div className="flex flex-col md:flex-row gap-3 items-stretch flex-wrap">
                    {/* From */}
                    <div className="flex-1 min-w-[160px] relative">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">From</label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 pointer-events-none z-10" />
                            <input type="text" list="airports-from" placeholder="City or IATA code (e.g. DEL)"
                                value={from} onChange={(e) => setFrom(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 font-medium text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                                required />
                            <datalist id="airports-from">
                                {AIRPORTS.map(a => <option key={a.value} value={a.label} />)}
                            </datalist>
                        </div>
                    </div>

                    {/* Swap */}
                    <div className="flex items-end pb-0.5 justify-center">
                        <button type="button" onClick={handleSwap}
                            className="hidden md:flex w-10 h-10 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-full items-center justify-center text-blue-600 transition-all hover:scale-110 mt-6">
                            <ArrowLeftRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* To */}
                    <div className="flex-1 min-w-[160px] relative">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">To</label>
                        <div className="relative">
                            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 pointer-events-none z-10" />
                            <input type="text" list="airports-to" placeholder="City or IATA code (e.g. BOM)"
                                value={to} onChange={(e) => setTo(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 font-medium text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                                required />
                            <datalist id="airports-to">
                                {AIRPORTS.map(a => <option key={a.value} value={a.label} />)}
                            </datalist>
                        </div>
                    </div>

                    {/* Depart Date */}
                    <div className="flex-1 min-w-[140px] relative">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">
                            {isRoundTrip ? 'Depart' : 'Date'}
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 pointer-events-none" />
                            <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 font-medium text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                                required />
                        </div>
                    </div>

                    {/* Return Date (round trip only) */}
                    {isRoundTrip && (
                        <div className="flex-1 min-w-[140px] relative">
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Return</label>
                            <div className="relative">
                                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-500 pointer-events-none" />
                                <input type="date" value={returnDate} min={date || today}
                                    onChange={(e) => setReturnDate(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 font-medium text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-white"
                                    required={isRoundTrip} />
                            </div>
                        </div>
                    )}

                    {/* Search Button */}
                    <div className="flex items-end">
                        <button type="submit"
                            className="w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-105 hover:shadow-blue-500/40 text-sm mt-6">
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
