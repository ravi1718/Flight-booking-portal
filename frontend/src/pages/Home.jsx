import React from 'react';
import FlightSearch from '../components/FlightSearch';
import { Plane, Globe, Shield, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div>
            <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center">
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0" 
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')" }}
                >
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>
                
                <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center pt-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
                            Discover Your Next <span className="text-blue-300">Adventure</span>
                        </h1>
                        <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto drop-shadow-md">
                            Find the best flights to your dream destinations globally with our premium booking experience.
                        </p>
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full">
                        <FlightSearch />
                    </motion.div>
                </div>
            </section>

            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Book With Us?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">Experience seamless travel planning with our industry-leading features designed for your comfort and security.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { icon: <Globe className="h-10 w-10 text-primary" />, title: "Global Reach", desc: "Access to over 500 airlines and thousands of destinations worldwide at your fingertips." },
                            { icon: <Shield className="h-10 w-10 text-primary" />, title: "Secure Booking", desc: "Bank-level encryption ensures your data and payments are 100% secure with us." },
                            { icon: <CreditCard className="h-10 w-10 text-primary" />, title: "Flexible Payments", desc: "Pay with your preferred method smoothly and transparently with zero hidden fees." }
                        ].map((feature, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="bg-blue-50 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-8 transform rotate-3">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
