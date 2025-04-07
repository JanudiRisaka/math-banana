# Math Banana Game

A distributed game demonstrating software architecture principles, event-driven programming, interoperability with the Banana API, and virtual identity management.

## Features
- 🎮 Multiple Difficulty Levels: Choose from Beginner, Advanced, or Expert modes with varying time limits and scoring
- 🔐 User Authentication: Secure Sign Up, Sign In, Password Reset, and Email Verification using OTP
- 📊 Profile Management: View stats, update username, and customize avatar using DiceBear API
- 🏆 Leaderboard: Compete with other players
- 🔊 Background music & animations
- 📈 Game Statistics: Track high score, games played, wins, and daily streak
- ✨ Interactive UI: Animations with Framer Motion and Lottie
- 📱 Responsive Design: Playable on all screen sizes

## Tech Stack
**Frontend:**
- React 19 + Vite
- React Router DOM
- Tailwind CSS
- Context API (Auth/Game/User)
- Axios/Fetch
- Framer Motion & Lottie-React
- Zod Validation
- DiceBear API

**Backend:**
- Node.js/Express
- MongoDB
- JWT/Cookie Authentication
- Nodemailer

**APIs**: [Banana API](https://marcconrad.com/uob/banana/doc.php), [DiceBear](https://www.dicebear.com/)

---

## 🚀 Setup & Installation

### 1. Clone Repository
```bash
git clone https://github.com/JanudiRisaka/math-banana.git
cd math-banana

### 2. Server Setup
cd server
npm install

### create .env file and add the following,
PORT=5000
MONGODB_URI="mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname?retryWrites=true&w=majority"
JWT_SECRET="your_jwt_secret_here"
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SENDER_EMAIL="your-email@gmail.com"

### 3. Client Setup
cd ../client
npm install

### create .env file and add the following,
VITE_API_BASE_URL=http://localhost:5000
NODE_ENV=development

### 5. Run Application
In separate terminals:
# Server
cd server
npm run dev

# Client
cd client
npm run dev