import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Backend URL

export const fetchPuzzle = async () => {
  const response = await axios.get('https://marcconrad.com/uob/banana/api.php');
  return { image: response.data.question, solution: response.data.solution };
};

export const validateAnswer = async (userAnswer, solution, userId, difficulty) => {
  const response = await axios.post(`${API_BASE_URL}/game/validate`, {
    userAnswer,
    solution,
    userId,
    difficulty,
  });
  return response.data.isCorrect;
};