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
  className="min-h-screen bg-gradient-to-b from-[#001B3D]/90 to-[#000B1A]/90 backdrop-blur-sm"
  style={{ backgroundImage: `url(${bg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        {!noHeaderPaths.includes(location.pathname) && <Header />}

        <main className="container mx-auto px-4 py-8">
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
        </main>
      </motion.div>
    </div>
  );
}