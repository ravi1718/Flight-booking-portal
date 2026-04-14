import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { generateDummyFlights } from '../utils/dummyFlights';
import { useBooking } from '../context/BookingContext';
import { motion } from 'framer-motion';
import { Plane, Clock, ArrowRight, Filter, ChevronDown, ChevronUp, Wifi, UtensilsCrossed, Tv, CheckCircle } from 'lucide-react';

const SORT_OPTIONS = [
    { label: 'Price: Low to High', value: 'price_asc' },
    { label: 'Price: High to Low', value: 'price_desc' },
    { label: 'Duration', value: 'duration' },
    { label: 'Departure', value: 'departure' },
];

const AmenityIcon = ({ name }) => {
    if (name === 'WiFi') return <Wifi className="h-3.5 w-3.5" />;
    if (name === 'Meals') return <UtensilsCrossed className="h-3.5 w-3.5" />;
    if (name === 'Entertainment') return <Tv className="h-3.5 w-3.5" />;
    return null;
};

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { selectFlight } = useBooking();
    const [sort, setSort] = useState('price_asc');
    const [maxPrice, setMaxPrice] = useState(20000);
    const [stopsFilter, setStopsFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    const from = searchParams.get('from') || 'DEL';
    const to = searchParams.get('to') || 'BOM';
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

    const allFlights = useMemo(() => generateDummyFlights(from, to, date), [from, to, date]);

    const filtered = useMemo(() => {
        let f = allFlights.filter(fl => fl.price <= maxPrice);
        if (stopsFilter === 'nonstop') f = f.filter(fl => fl.stops === 0);
        if (stopsFilter === 'stops') f = f.filter(fl => fl.stops > 0);
        if (sort === 'price_asc') f = [...f].sort((a, b) => a.price - b.price);
        if (sort === 'price_desc') f = [...f].sort((a, b) => b.price - a.price);
        if (sort === 'duration') f = [...f].sort((a, b) => a.durationMins - b.durationMins);
        if (sort === 'departure') f = [...f].sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime));
        return f;
    }, [allFlights, sort, maxPrice, stopsFilter]);

    const handleSelect = (flight) => {
        selectFlight(flight);
        navigate(`/flight/${flight._id}`);
    };

    const fmt = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fmtDate = (iso) => new Date(iso).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' });

    return (
        <div className="min-h-screen bg-[#f0f4ff] pt-20 pb-12">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-8 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center space-x-3 text-2xl font-bold mb-1">
                                <span>{from.toUpperCase()}</span>
                                <Plane className="h-5 w-5 text-blue-300" />
                                <span>{to.toUpperCase()}</span>
                            </div>
                            <p className="text-blue-200 text-sm">{fmtDate(date + 'T00:00:00')} • One Way • 1 Adult</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="bg-white/15 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-semibold border border-white/20">
                                {filtered.length} flights found
                            </div>
                            <button
                                onClick={() => navigate('/search')}
                                className="bg-white text-blue-700 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-blue-50 transition-colors"
                            >
                                Modify Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-6xl mt-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="w-full flex items-center justify-between p-5 font-bold text-gray-800 lg:cursor-default"
                            >
                                <span className="flex items-center space-x-2">
                                    <Filter className="h-4 w-4 text-blue-600" />
                                    <span>Filters</span>
                                </span>
                                <span className="lg:hidden">
                                    {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                </span>
                            </button>
                            <div className={`px-5 pb-5 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                                {/* Stops */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Stops</p>
                                    <div className="space-y-2">
                                        {[['all', 'Any'], ['nonstop', 'Non-stop'], ['stops', '1+ Stop']].map(([val, label]) => (
                                            <label key={val} className="flex items-center space-x-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="stops"
                                                    checked={stopsFilter === val}
                                                    onChange={() => setStopsFilter(val)}
                                                    className="accent-blue-600"
                                                />
                                                <span className="text-sm text-gray-700 group-hover:text-blue-600 font-medium">{label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Price */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Max Price</p>
                                    <p className="text-2xl font-bold text-blue-700 mb-3">₹{maxPrice.toLocaleString()}</p>
                                    <input
                                        type="range"
                                        min={3000}
                                        max={25000}
                                        step={500}
                                        value={maxPrice}
                                        onChange={e => setMaxPrice(Number(e.target.value))}
                                        className="w-full accent-blue-600"
                                    />
                                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                                        <span>₹3,000</span>
                                        <span>₹25,000</span>
                                    </div>
                                </div>

                                {/* Sort */}
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sort By</p>
                                    <div className="space-y-2">
                                        {SORT_OPTIONS.map(opt => (
                                            <label key={opt.value} className="flex items-center space-x-2 cursor-pointer group">
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    checked={sort === opt.value}
                                                    onChange={() => setSort(opt.value)}
                                                    className="accent-blue-600"
                                                />
                                                <span className="text-sm text-gray-700 group-hover:text-blue-600 font-medium">{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Flight Cards */}
                    <div className="flex-1 space-y-4">
                        {filtered.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                                <Plane className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No flights match your filters</h3>
                                <p className="text-gray-400">Try adjusting your price or stop filters</p>
                            </div>
                        ) : (
                            filtered.map((flight, i) => (
                                <motion.div
                                    key={flight._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden hover:shadow-card-hover hover:border-blue-100 transition-all duration-300 group"
                                >
                                    <div className="p-5 md:p-6">
                                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                                            {/* Airline */}
                                            <div className="flex items-center space-x-3 md:w-44">
                                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl font-bold text-blue-700 flex-shrink-0">
                                                    {flight.logo}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm">{flight.airline}</p>
                                                    <p className="text-gray-400 text-xs">{flight.flightNumber}</p>
                                                    <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{flight.class}</span>
                                                </div>
                                            </div>

                                            {/* Route / Time */}
                                            <div className="flex items-center flex-1 gap-3">
                                                <div className="text-center">
                                                    <p className="text-2xl font-extrabold text-gray-900">{fmt(flight.departureTime)}</p>
                                                    <p className="text-sm font-semibold text-gray-500">{flight.from.toUpperCase()}</p>
                                                </div>

                                                <div className="flex-1 flex flex-col items-center px-2">
                                                    <div className="flex items-center text-gray-400 text-xs mb-1.5 font-medium">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {flight.duration}
                                                    </div>
                                                    <div className="w-full flex items-center">
                                                        <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                                                        <div className="flex-1 h-px bg-gradient-to-r from-blue-400 to-blue-600 relative">
                                                            <Plane className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-600" />
                                                        </div>
                                                        <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0" />
                                                    </div>
                                                    <p className={`text-xs mt-1.5 font-semibold ${flight.stops === 0 ? 'text-green-600' : 'text-orange-500'}`}>
                                                        {flight.stops === 0 ? 'Non-stop' : `${flight.stops} Stop`}
                                                    </p>
                                                </div>

                                                <div className="text-center">
                                                    <p className="text-2xl font-extrabold text-gray-900">{fmt(flight.arrivalTime)}</p>
                                                    <p className="text-sm font-semibold text-gray-500">{flight.to.toUpperCase()}</p>
                                                </div>
                                            </div>

                                            {/* Price + CTA */}
                                            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:w-40 md:pl-4 md:border-l md:border-gray-100">
                                                <div className="text-right">
                                                    <p className="text-2xl font-extrabold text-blue-700">₹{flight.price.toLocaleString()}</p>
                                                    <p className="text-xs text-gray-400 font-medium">per person</p>
                                                    <p className="text-xs text-green-600 font-semibold mt-0.5">{flight.seatsAvailable} seats left</p>
                                                </div>
                                                <button
                                                    onClick={() => handleSelect(flight)}
                                                    className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105 text-sm whitespace-nowrap"
                                                >
                                                    <span>Select</span>
                                                    <ArrowRight className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Amenities */}
                                        {flight.amenities.length > 0 && (
                                            <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-50">
                                                {flight.amenities.map(a => (
                                                    <span key={a} className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full font-medium">
                                                        <AmenityIcon name={a} />
                                                        <span>{a}</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResults;
