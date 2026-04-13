import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar } from 'lucide-react';
import Button from './UI/Button';

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

    return (
        <div className="glass-dark p-6 rounded-2xl shadow-xl w-full max-w-4xl mx-auto border border-white/10 mt-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent"></div>
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-200 mb-1">From</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Departure City"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            required
                        />
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-200 mb-1">To</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Arrival City"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                            required
                        />
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium text-gray-200 mb-1">Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary transition-all [color-scheme:dark]"
                            required
                        />
                    </div>
                </div>
                <Button type="submit" className="w-full md:w-auto px-8 py-3 h-[52px]">
                    <Search className="mr-2 h-5 w-5" />
                    Search
                </Button>
            </form>
        </div>
    );
};

export default FlightSearch;
