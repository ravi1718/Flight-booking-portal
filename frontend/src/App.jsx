import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, SignInButton } from '@clerk/react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import FlightDetails from './pages/FlightDetails';
import Booking from './pages/Booking';
import AddOns from './pages/AddOns';
import Payment from './pages/Payment';
import Confirmation from './pages/Confirmation';
import MyBookings from './pages/MyBookings';

// Protected route using useAuth hook (works in @clerk/react v6)
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#f0f4ff] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-12 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Sign in Required</h2>
          <p className="text-gray-500 mb-8">Please sign in to access this page and manage your bookings.</p>
          <SignInButton mode="modal">
            <button className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105">
              Sign In to Continue →
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#f0f4ff] flex flex-col font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/flight/:id" element={<FlightDetails />} />
            <Route path="/book/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/addons/:id" element={<ProtectedRoute><AddOns /></ProtectedRoute>} />
            <Route path="/payment/:id" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
            <Route path="/confirmation/:id" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
            <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
