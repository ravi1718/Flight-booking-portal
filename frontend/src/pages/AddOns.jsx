import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { motion } from 'framer-motion';
import { Utensils, Briefcase, Shield, Star, ArrowUpCircle, ArrowLeft, ArrowRight, Plane, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const MEAL_OPTIONS = [
    { type: 'No Meal',       price: 0,   desc: 'Skip in-flight meal' },
    { type: 'Vegetarian',    price: 350, desc: 'Plant-based meal' },
    { type: 'Non-Vegetarian',price: 400, desc: 'Chicken / Fish option' },
    { type: 'Jain Meal',     price: 350, desc: 'No root vegetables' },
];

const BAGGAGE_OPTIONS = [
    { kgs: 0,  price: 0,    label: 'No Extra',  desc: 'Cabin baggage only' },
    { kgs: 5,  price: 800,  label: '+5 kg',     desc: 'Small check-in bag' },
    { kgs: 10, price: 1500, label: '+10 kg',    desc: 'Standard check-in' },
    { kgs: 15, price: 2200, label: '+15 kg',    desc: 'Large check-in bag' },
];

const INSURANCE_OPTIONS = [
    { plan: 'None',    price: 0,   desc: 'No coverage' },
    { plan: 'Basic',   price: 299, desc: 'Trip cancellation + medical' },
    { plan: 'Premium', price: 599, desc: 'Full cover + lost baggage' },
];

const UPGRADE_OPTIONS = (currentClass) => {
    const opts = [{ toClass: '', price: 0, label: 'No Upgrade', desc: `Stay in ${currentClass}` }];
    if (currentClass === 'Economy') {
        opts.push({ toClass: 'Business',    price: 3500, label: 'Business Class',    desc: 'Extra legroom, priority service' });
        opts.push({ toClass: 'First Class', price: 7000, label: 'First Class',       desc: 'Lie-flat seat, premium dining' });
    } else if (currentClass === 'Business') {
        opts.push({ toClass: 'First Class', price: 3500, label: 'First Class',       desc: 'Lie-flat seat, premium dining' });
    }
    return opts;
};

const SectionCard = ({ icon: Icon, title, accent, children }) => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className={`flex items-center space-x-3 px-6 py-4 border-b border-gray-100 ${accent}`}>
            <Icon className="h-5 w-5" />
            <h3 className="font-bold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">{children}</div>
    </motion.div>
);

const AddOns = () => {
    const navigate = useNavigate();
    const { currentBooking: booking, saveBooking } = useBooking();

    const [meals, setMeals] = useState(() =>
        (booking?.passengers || []).map(() => ({ type: 'No Meal', price: 0 }))
    );
    const [baggage, setBaggage] = useState({ kgs: 0, price: 0 });
    const [insurance, setInsurance] = useState({ plan: 'None', price: 0 });
    const [priority, setPriority] = useState({ selected: false, price: 0 });
    const [upgrade, setUpgrade] = useState({ toClass: '', price: 0 });

    if (!booking) {
        return (
            <div className="min-h-screen bg-[#f0f4ff] pt-28 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700 mb-4">No booking found</h2>
                    <button onClick={() => navigate('/')} className="text-blue-600 font-semibold hover:underline">← Search Flights</button>
                </div>
            </div>
        );
    }

    const flight = booking.flight;
    const passengerCount = booking.passengers?.length || 1;
    const flightClass = flight?.class || 'Economy';
    const upgradeOpts = UPGRADE_OPTIONS(flightClass);

    const addOnsTotal =
        meals.reduce((s, m) => s + m.price, 0) +
        baggage.price +
        insurance.price +
        priority.price +
        upgrade.price * passengerCount;

    const grandTotal = (booking.totalAmount || 0) + addOnsTotal;

    const handleMealChange = (i, option) => {
        const updated = [...meals];
        updated[i] = { type: option.type, price: option.price };
        setMeals(updated);
    };

    const handleContinue = () => {
        const addOnsPayload = {
            meals: meals.map((m, i) => ({ passengerIndex: i, type: m.type, price: m.price })),
            extraBaggage: baggage,
            insurance,
            priorityBoarding: priority,
            seatUpgrade: { toClass: upgrade.toClass, price: upgrade.price * passengerCount },
        };
        saveBooking({ ...booking, pendingAddOns: addOnsPayload, addOnsTotal });
        navigate(`/payment/${booking._id}`);
    };

    const fmt = (iso) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-[#f0f4ff] pt-20 pb-16">
            <div className="container mx-auto px-4 max-w-5xl">
                <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 font-medium mb-6 mt-4 transition-colors">
                    <ArrowLeft className="h-4 w-4" /><span>Back</span>
                </button>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8 space-x-2 overflow-x-auto pb-1">
                    {['Search','Select','Passengers','Add-ons','Payment','Confirm'].map((step, i) => (
                        <React.Fragment key={step}>
                            <div className={`flex items-center space-x-1.5 ${i <= 3 ? 'text-blue-600' : 'text-gray-300'}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${i <= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>{i + 1}</div>
                                <span className="text-xs font-semibold hidden md:block whitespace-nowrap">{step}</span>
                            </div>
                            {i < 5 && <div className={`flex-1 h-px min-w-[12px] max-w-10 ${i < 3 ? 'bg-blue-400' : 'bg-gray-200'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                <h2 className="text-3xl font-extrabold text-gray-900 mb-1">Enhance Your Journey</h2>
                <p className="text-gray-500 mb-8">Optional add-ons — skip any you don't need</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-5">

                        {/* Meals */}
                        <SectionCard icon={Utensils} title="Meal Preference" accent="bg-orange-50 text-orange-600">
                            <div className="space-y-4">
                                {booking.passengers.map((p, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{p.name || `Passenger ${i + 1}`}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {MEAL_OPTIONS.map(opt => (
                                                <button key={opt.type} type="button"
                                                    onClick={() => handleMealChange(i, opt)}
                                                    className={`text-left px-3 py-2.5 rounded-xl border-2 transition-all text-sm ${meals[i]?.type === opt.type ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-orange-200'}`}>
                                                    <p className="font-semibold text-gray-800">{opt.type}</p>
                                                    <p className="text-xs text-gray-400">{opt.price === 0 ? 'Free' : `₹${opt.price}`} · {opt.desc}</p>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>

                        {/* Extra Baggage */}
                        <SectionCard icon={Briefcase} title="Extra Baggage" accent="bg-blue-50 text-blue-600">
                            <div className="grid grid-cols-2 gap-3">
                                {BAGGAGE_OPTIONS.map(opt => (
                                    <button key={opt.kgs} type="button"
                                        onClick={() => setBaggage({ kgs: opt.kgs, price: opt.price })}
                                        className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${baggage.kgs === opt.kgs ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                                        <p className="font-bold text-gray-800">{opt.label}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{opt.price === 0 ? 'Free' : `+₹${opt.price.toLocaleString()}`}</p>
                                        <p className="text-xs text-gray-400">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </SectionCard>

                        {/* Travel Insurance */}
                        <SectionCard icon={Shield} title="Travel Insurance" accent="bg-green-50 text-green-600">
                            <div className="grid grid-cols-3 gap-3">
                                {INSURANCE_OPTIONS.map(opt => (
                                    <button key={opt.plan} type="button"
                                        onClick={() => setInsurance({ plan: opt.plan, price: opt.price })}
                                        className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${insurance.plan === opt.plan ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-200'}`}>
                                        <p className="font-bold text-gray-800">{opt.plan}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{opt.price === 0 ? 'Free' : `+₹${opt.price}`}</p>
                                        <p className="text-xs text-gray-400">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </SectionCard>

                        {/* Priority Boarding */}
                        <SectionCard icon={Star} title="Priority Boarding" accent="bg-yellow-50 text-yellow-600">
                            <div className="grid grid-cols-2 gap-3">
                                {[{ selected: false, price: 0, label: 'Standard Boarding', desc: 'Board with your group' },
                                  { selected: true,  price: 299, label: 'Priority Boarding', desc: 'Board first, your choice of overhead bin' }
                                ].map(opt => (
                                    <button key={String(opt.selected)} type="button"
                                        onClick={() => setPriority({ selected: opt.selected, price: opt.price })}
                                        className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${priority.selected === opt.selected ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 hover:border-yellow-200'}`}>
                                        <p className="font-bold text-gray-800">{opt.label}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{opt.price === 0 ? 'Free' : `+₹${opt.price}`}</p>
                                        <p className="text-xs text-gray-400">{opt.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </SectionCard>

                        {/* Class Upgrade */}
                        {upgradeOpts.length > 1 && (
                            <SectionCard icon={ArrowUpCircle} title="Class Upgrade" accent="bg-purple-50 text-purple-600">
                                <div className="grid grid-cols-1 gap-3">
                                    {upgradeOpts.map(opt => (
                                        <button key={opt.toClass || 'none'} type="button"
                                            onClick={() => setUpgrade({ toClass: opt.toClass, price: opt.price })}
                                            className={`text-left px-4 py-3 rounded-xl border-2 transition-all ${upgrade.toClass === opt.toClass ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-gray-800">{opt.label}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
                                                </div>
                                                <p className="text-sm font-bold text-purple-700 ml-4">
                                                    {opt.price === 0 ? 'Free' : `+₹${(opt.price * passengerCount).toLocaleString()}`}
                                                    {opt.price > 0 && <span className="text-xs font-normal text-gray-400 block">₹{opt.price.toLocaleString()}/pax</span>}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </SectionCard>
                        )}
                    </div>

                    {/* Sticky Summary */}
                    <div>
                        <div className="bg-gray-900 rounded-2xl p-6 text-white sticky top-24">
                            <h3 className="font-bold text-lg mb-5 pb-4 border-b border-gray-700">Order Summary</h3>

                            <div className="bg-gray-800 rounded-xl p-4 mb-5">
                                <p className="text-sm font-bold text-gray-300 mb-2">{flight?.airline} · {flight?.flightNumber}</p>
                                <div className="flex justify-between items-center">
                                    <div className="text-center">
                                        <p className="text-lg font-extrabold">{fmt(flight?.departureTime)}</p>
                                        <p className="text-xs text-gray-400">{flight?.from}</p>
                                    </div>
                                    <Plane className="h-4 w-4 text-blue-400" />
                                    <div className="text-center">
                                        <p className="text-lg font-extrabold">{fmt(flight?.arrivalTime)}</p>
                                        <p className="text-xs text-gray-400">{flight?.to}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm mb-5">
                                <div className="flex justify-between text-gray-400">
                                    <span>Base fare</span>
                                    <span className="text-white font-semibold">₹{(booking.totalAmount || 0).toLocaleString()}</span>
                                </div>
                                {meals.some(m => m.price > 0) && (
                                    <div className="flex justify-between text-gray-400">
                                        <span>Meals</span>
                                        <span className="text-white">+₹{meals.reduce((s, m) => s + m.price, 0).toLocaleString()}</span>
                                    </div>
                                )}
                                {baggage.price > 0 && (
                                    <div className="flex justify-between text-gray-400">
                                        <span>Extra baggage</span>
                                        <span className="text-white">+₹{baggage.price.toLocaleString()}</span>
                                    </div>
                                )}
                                {insurance.price > 0 && (
                                    <div className="flex justify-between text-gray-400">
                                        <span>Insurance</span>
                                        <span className="text-white">+₹{insurance.price}</span>
                                    </div>
                                )}
                                {priority.price > 0 && (
                                    <div className="flex justify-between text-gray-400">
                                        <span>Priority boarding</span>
                                        <span className="text-white">+₹{priority.price}</span>
                                    </div>
                                )}
                                {upgrade.price > 0 && (
                                    <div className="flex justify-between text-gray-400">
                                        <span>Class upgrade</span>
                                        <span className="text-white">+₹{(upgrade.price * passengerCount).toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-700 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400 text-sm">Total</span>
                                    <span className="text-3xl font-extrabold">₹{grandTotal.toLocaleString()}</span>
                                </div>
                                {addOnsTotal > 0 && (
                                    <p className="text-xs text-green-400 mt-1 text-right">
                                        +₹{addOnsTotal.toLocaleString()} in add-ons
                                    </p>
                                )}
                            </div>

                            {addOnsTotal === 0 && (
                                <p className="text-xs text-gray-500 text-center mb-4 flex items-center justify-center space-x-1">
                                    <CheckCircle className="h-3.5 w-3.5 text-gray-500" />
                                    <span>No add-ons selected — that's fine!</span>
                                </p>
                            )}

                            <button onClick={handleContinue}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 text-base flex items-center justify-center space-x-2">
                                <span>Continue to Payment</span>
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddOns;
