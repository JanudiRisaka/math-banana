// // services/ApiService.js
// import api from '../utils/api';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export const fetchPuzzle = async () => {
//   try {
//     const response = await api.get('https://marcconrad.com/uob/banana/api.php');
//     return { image: response.data.question, solution: response.data.solution };
//   } catch (error) {
//     console.error('Error fetching puzzle:', error);
//     throw new Error('Failed to fetch puzzle');
//   }
// };

// export const validateAnswer = async (userAnswer, solution, userId, difficulty) => {
//   try {
//     const response = await api.post(`${API_BASE_URL}/game/validate`, {
//       userAnswer,
//       solution,
//       userId,
//       difficulty,
//     });
//     return response.data.isCorrect;
//   } catch (error) {
//     console.error('Error validating answer:', error);
//     throw new Error('Failed to validate answer');
//   }
// };
