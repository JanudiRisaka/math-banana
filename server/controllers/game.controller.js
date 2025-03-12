import Score from '../models/score.model.js';  // Assuming you have a Score model to handle scores in the database

// Create a new score
export const createScore = async (req, res) => {
  try {
    const { score } = req.body;  // Assuming you send the score in the request body
    const userId = req.user._id;  // Get the user ID from the authenticated user

    // Create a new score entry in the database
    const newScore = new Score({
      user: userId,
      score: score,
      date: new Date(),
    });

    await newScore.save();

    res.status(201).json({ message: 'Score saved successfully', score: newScore });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the leaderboard (sorted by score, highest first)
export const getLeaderboard = async (req, res) => {
  try {
    // Get all scores and sort them by score in descending order
    const leaderboard = await Score.find().sort({ score: -1 }).limit(10); // Limit to top 10 scores

    res.status(200).json({ leaderboard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get the scores for a specific user
export const getScoreForUser = async (req, res) => {
  try {
    const { userId } = req.params;  // Get userId from the URL parameters

    // Find all scores for the given user
    const scores = await Score.find({ user: userId });

    if (!scores || scores.length === 0) {
      return res.status(404).json({ message: 'No scores found for this user' });
    }

    res.status(200).json({ scores });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
