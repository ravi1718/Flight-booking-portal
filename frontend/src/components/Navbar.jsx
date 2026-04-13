import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plane, User, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './UI/Button';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass shadow-sm py-3' : 'bg-transparent py-4'}`}>
            <div className="container mx-auto px-4 md:px-8 max-w-7xl">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 group">
                        <div className="bg-primary p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                            <Plane className="text-white h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                            FlightBooker
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex space-x-8 items-center font-medium text-gray-700">
                        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
                        <Link to="/search" className="hover:text-primary transition-colors">Search Flights</Link>
                        {user ? (
                            <>
                                <Link to="/my-bookings" className="hover:text-primary transition-colors">My Bookings</Link>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm font-semibold border border-blue-200 bg-blue-50 px-3 py-1 rounded-full text-primary">
                                        Hi, {user.name.split(' ')[0]}
                                    </span>
                                    <Button variant="ghost" onClick={handleLogout} className="!p-2 text-gray-500 hover:text-red-500 hover:bg-red-50">
                                        <LogOut className="h-5 w-5" />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <div className="flex space-x-4">
                                <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
                                <Button variant="primary" onClick={() => navigate('/register')}>Register</Button>
                            </div>
                        )}
                    </nav>

                    {/* Mobile Toggle */}
                    <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-t border-gray-100 mt-3 absolute w-full"
                    >
                        <div className="flex flex-col p-4 space-y-4">
                            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors font-medium text-gray-700">Home</Link>
                            <Link to="/search" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors font-medium text-gray-700">Search Flights</Link>
                            {user ? (
                                <>
                                    <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} className="px-4 py-2 hover:bg-blue-50 rounded-lg transition-colors font-medium text-gray-700">My Bookings</Link>
                                    <button onClick={handleLogout} className="px-4 py-2 text-left font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors">Logout</button>
                                </>
                            ) : (
                                <div className="grid gap-3 pt-2">
                                    <Button variant="secondary" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Login</Button>
                                    <Button variant="primary" onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}>Register</Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
