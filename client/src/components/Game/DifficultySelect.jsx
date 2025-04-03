// src/components/DifficultySelect.jsx
/**
 * Difficulty Selection Component - Allows players to choose game difficulty
 * Demonstrates software design principles:
 * - High Cohesion: Focused solely on difficulty selection UI/UX
 * - Low Coupling: Communicates via callback prop (onSelect)
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Flame } from 'lucide-react';
import { Button } from '../Layout/Button';

const DifficultySelect = ({ onSelect }) => {
  // Difficulty configuration demonstrates data-driven design
  const difficulties = [
    {
      level: 'low',
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Beginner',
      description: '60 seconds per round',
      color: 'from-green-400 to-emerald-600',
    },
    {
      level: 'medium',
      icon: <Zap className="w-8 h-8" />,
      title: 'Advanced',
      description: '45 seconds per round',
      color: 'from-blue-400 to-indigo-600',
    },
    {
      level: 'hard',
      icon: <Flame className="w-8 h-8" />,
      title: 'Expert',
      description: '30 seconds per round',
      color: 'from-red-400 to-rose-600',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-6"
      >
        <h2 className="text-3xl font-bold text-center text-white mb-8 font-serif">
          Choose Your Challenge
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {difficulties.map(({ level, icon, title, description, color }) => (
            <motion.div
              key={level}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => onSelect(level)}
                className={`w-full h-full p-6 rounded-lg bg-gradient-to-br ${color} hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex flex-col items-center text-white">
                  <div className="mb-4">{icon}</div>
                  <h3 className="text-xl font-bold mb-2">{title}</h3>
                  <p className="text-sm opacity-90">{description}</p>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DifficultySelect;
