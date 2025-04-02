import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
// Component imports
import Game from './pages/Game';
import Help from './pages/Help';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserProfile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
// Assets
import bg from './assets/background.jpg';
// Store

export default function App() {
  const location = useLocation();

  const noHeaderPaths = ['/signin', '/signup', '/verify-email'];


  return (
    <div
      className="min-h-screen flex flex-col" // Added flex layout
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        background: 'linear-gradient(to bottom, #001B3D/90, #000B1A/90)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col px-4 pt-8" // Changed to flex-col and flex-1
      >
        {!noHeaderPaths.includes(location.pathname) && <Header />}

        <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
  path="/game"
  element={
    <ProtectedRoute>
      <Game />
    </ProtectedRoute>
  }
/>
Add User Data Loading State:
            <Route path="/help" element={<Help />} />
            <Route path="/verify-email" element={<EmailVerify />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }/>
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }/>

            {/* Redirects */}
            <Route path="/verify-email-pending" element={<Navigate to="/verify-email" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          </div>
        </main>
        <div className="mt-auto">
          <Footer />
        </div>
      </motion.div>
    </div>
  );
}