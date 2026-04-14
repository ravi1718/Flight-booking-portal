import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ClerkProvider } from '@clerk/react';
import { BookingProvider } from './context/BookingContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <BookingProvider>
        <App />
        <ToastContainer position="bottom-right" theme="colored" autoClose={3000} />
      </BookingProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
