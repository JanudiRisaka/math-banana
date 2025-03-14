import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // <-- Add Navigate here
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './contexts/AuthContext'; // Ensure correct import
import Game from './pages/Game';
import Help from './pages/Help';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import UserProfile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Header from './components/Layout/Header';
import MainMenu from './pages/MainMenu';
import bg from './assets/background.jpg';

export default function App() {
  const location = useLocation();

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
        {/* Conditionally render Header based on current path */}
        {(location.pathname !== '/signin' && location.pathname !== '/signup') && <Header />}

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/game" element={<Game />} />
            <Route path="/help" element={<Help />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />
            {/* Catch-all for undefined routes */}
            <Route path="*" element={<Navigate to="/signin" />} />
          </Routes>
        </main>
      </motion.div>
    </div>
  );
}
