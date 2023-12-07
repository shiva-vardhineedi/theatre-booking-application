import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import HomePage from "./HomePage";
import MovieSchedule  from "./MovieSchedule"
import Register from "./Register";
import Login from "./Login";
import MemberDashboard from "./MemberDashboard";
import AdminMovie from "./AdminMovie";
import Landing from "./Landing";
import Booking from './Bookings';
import ProtectedRoute from './ProtectedRoute'; // Make sure this path is correct
import { AuthProvider } from './AuthContext';
import TicketsAndPoints from './TicketsandPoints';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cancellation from './CancellationPage';
import PremiumFeatures from './PremiumFeatures';
import Checkout from './Checkout';


const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap your application with AuthProvider */}
      <Router>
        <Routes>
          <Route exact path="/" element={<App />} />
          <Route path="/homepage" element={<HomePage />} />
          {/* ... other public routes ... */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Wrap protected routes with ProtectedRoute component */}
          <Route
            path="/movie-schedule"
            element={
              <ProtectedRoute>
                <MovieSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/memberDashboard"
            element={
              <ProtectedRoute>
                <MemberDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adminMovie"
            element={
                <AdminMovie />
            }
          />
          <Route
            path="/landing"
            element={
              <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />

            <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketsAndPoints />
              </ProtectedRoute>
            }
          />

            <Route
            path="/cancel"
            element={
              <ProtectedRoute>
                <Cancellation />
              </ProtectedRoute>
            }
          />

            <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

            <Route
            path="/premium-features"
            element={
                <PremiumFeatures />
            }
          />
          <Route path="/landing" element={<Landing />} />
        <Route path="/tickets" element={<TicketsAndPoints />} />

        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
