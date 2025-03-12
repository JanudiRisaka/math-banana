import Score from '../models/score.model.js';  // Ensure you use the correct file extension

// Get the leaderboard (sorted by score, highest first)
const getLeaderboard = async (req, res) => {
  try {
    // Get all scores and sort them by score in descending order
    const leaderboard = await Score.find()
      .sort({ score: -1 }) // Sort by score in descending order
      .limit(10); // Limit to top 10 scores

    if (!leaderboard || leaderboard.length === 0) {
      return res.status(404).json({ message: 'No scores found' });
    }

    res.status(200).json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { getLeaderboard };  // Named export
