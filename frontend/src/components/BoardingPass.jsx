import React from 'react';
import { Plane } from 'lucide-react';

const fmt = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
const fmtDate = (iso) => new Date(iso).toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

const BoardingPass = ({ data, flight, passengers }) => {
    if (!data || !flight) return null;

    return (
        <div className="space-y-4 print:space-y-6">
            {passengers.map((passenger, idx) => (
                <div
                    key={idx}
                    className="bg-white border-2 border-blue-100 rounded-2xl overflow-hidden shadow-lg print:shadow-none print:border print:border-gray-300 print:rounded-none"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Plane className="h-6 w-6" />
                            <div>
                                <p className="font-black text-lg tracking-wide">FlightBooker</p>
                                <p className="text-blue-200 text-xs">{flight.airline} · {flight.flightNumber}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-blue-200 uppercase tracking-widest">Boarding Pass</p>
                            <p className="font-black text-xl tracking-widest">{data.pnr}</p>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex divide-x divide-dashed divide-blue-200">
                        {/* Left — route info */}
                        <div className="flex-1 p-5 space-y-4">
                            {/* Route */}
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    <p className="text-3xl font-black text-gray-900">{flight.from}</p>
                                    <p className="text-xs text-gray-500 font-medium">Origin</p>
                                    <p className="text-2xl font-bold text-blue-700 mt-1">{fmt(flight.departureTime)}</p>
                                </div>
                                <div className="flex flex-col items-center px-4">
                                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                                    <div className="w-px flex-1 bg-blue-300 my-1" style={{ minHeight: '24px' }} />
                                    <Plane className="h-5 w-5 text-blue-600 rotate-90" />
                                    <div className="w-px flex-1 bg-blue-300 my-1" style={{ minHeight: '24px' }} />
                                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-black text-gray-900">{flight.to}</p>
                                    <p className="text-xs text-gray-500 font-medium">Destination</p>
                                    <p className="text-2xl font-bold text-blue-700 mt-1">{fmt(flight.arrivalTime)}</p>
                                </div>
                            </div>

                            {/* Date */}
                            <div className="text-center">
                                <p className="text-sm text-gray-500">{fmtDate(flight.departureTime)}</p>
                            </div>

                            {/* Passenger */}
                            <div className="bg-blue-50 rounded-xl p-3">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Passenger</p>
                                <p className="font-black text-gray-900 text-lg">{passenger.name.toUpperCase()}</p>
                                <p className="text-sm text-gray-600">{passenger.gender} · Age {passenger.age}</p>
                            </div>
                        </div>

                        {/* Right — gate/seat info */}
                        <div className="w-40 p-5 flex flex-col justify-between bg-blue-50/30">
                            <div className="space-y-3">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Seat</p>
                                    <p className="text-3xl font-black text-blue-700">{data.seatNumbers[idx] || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Gate</p>
                                    <p className="text-2xl font-black text-gray-800">{data.gate}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Terminal</p>
                                    <p className="text-xl font-bold text-gray-800">{data.terminal}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Board By</p>
                                    <p className="text-lg font-bold text-red-600">{fmt(data.boardingTime)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Class</p>
                                    <p className="text-sm font-bold text-gray-700">{flight.class}</p>
                                </div>
                            </div>

                            {/* Barcode */}
                            <div className="mt-4 text-center">
                                <p
                                    className="text-gray-800 leading-none select-none overflow-hidden"
                                    style={{ fontFamily: "'Libre Barcode 39', cursive", fontSize: '2.5rem' }}
                                    title={data.barcodeData}
                                >
                                    {data.barcodeData}
                                </p>
                                <p className="text-xs text-gray-400 mt-1 font-mono">{data.pnr}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BoardingPass;
