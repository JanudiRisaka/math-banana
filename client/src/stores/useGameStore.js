import { create } from 'zustand';

export const useGameStore = create((set) => ({
  // State
  score: 0,
  isMuted: false,
  isAuthenticated: false,
  highScores: [
    { name: 'Math Wizard', score: 1200 },
    { name: 'Number Knight', score: 950 },
    { name: 'Equation Master', score: 800 },
    { name: 'Logic Lord', score: 750 },
    { name: 'Formula Fighter', score: 600 },
  ],

  // Actions
  setScore: (score) => set({ score }),
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setAuthenticated: (status) => set({ isAuthenticated: status }),
  addHighScore: (name, score) => {
    set((state) => ({
      highScores: [...state.highScores, { name, score }]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
    }));
  },
  resetGame: () => set({ score: 0 }),
}));