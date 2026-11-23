# Math Banana

Math Banana is a browser game where players solve timed arithmetic puzzles, earn points, and compete on a leaderboard. I built it for **CIS045-3 Distributed Service Architectures** at the University of Bedfordshire.

## How to play

Sign up, verify your email, sign in, and choose a difficulty. Each game starts with three lives. Correct answers earn points and wrong answers cost a life. The game ends when the timer runs out or you run out of lives. Your profile shows your high score and daily streak.

| Difficulty | Time limit | Points per correct answer |
| --- | ---: | ---: |
| Beginner | 60 seconds | 100 |
| Advanced | 45 seconds | 150 |
| Expert | 30 seconds | 200 |

## Run locally

You need Node.js and npm (the frontend build was verified on Node.js 24), a MongoDB Atlas connection or another transaction-capable MongoDB deployment, and Brevo SMTP credentials for verification and password reset emails.

```bash
git clone https://github.com/JanudiRisaka/math-banana.git
cd math-banana
npm --prefix server ci
npm --prefix client ci
```

Copy [server/.env.example](server/.env.example) to `server/.env` and [client/.env.example](client/.env.example) to `client/.env`. Fill in the server settings below and keep the local defaults for ports and URLs.

| Server variable | Value |
| --- | --- |
| `MONGO_URI` | MongoDB connection URI with a database name |
| `JWT_SECRET` | A newly generated random secret |
| `SMTP_USER`, `SMTP_PASS` | Brevo SMTP username and SMTP key |
| `SENDER_EMAIL` | A sender address verified in Brevo |

From the repository root, run these in separate terminals:

```bash
npm --prefix server run dev
```

```bash
npm --prefix client run dev
```

Open [http://localhost:5173](http://localhost:5173). The API listens on port 5000 by default. Open [the health endpoint](http://localhost:5000/api/health) to check that it responds.

## Architecture and coursework

The React/Vite client fetches puzzles directly from the [Banana API](https://marcconrad.com/uob/banana/doc.php). The Express API manages authentication, profiles, and scores in MongoDB. Nodemailer sends verification and reset emails through Brevo, and DiceBear provides avatars.

| Coursework concept | Where to look |
| --- | --- |
| Low coupling and high cohesion | [GameContext](client/src/context/GameContext.jsx) groups shared game state and score requests. [Game routes](server/routes/game.route.js) map endpoints to their handlers. |
| Event-driven programming | In [GameBoard](client/src/components/Game/GameBoard.jsx), timer ticks update the countdown and answer submissions update score or lives. |
| Interoperability | [GameBoard](client/src/components/Game/GameBoard.jsx) consumes an external JSON response with a puzzle image URL and its solution. |
| Virtual identity | [AuthContext](client/src/context/AuthContext.jsx) manages the signed-in session. The server’s [auth middleware](server/middleware/userAuth.js) verifies the JWT cookie on protected requests. |

See the [architecture notes](docs/ARCHITECTURE.md) and [event examples](docs/EVENTS.md) for more detail.

## Testing

[GitHub Actions](https://github.com/JanudiRisaka/math-banana/actions) runs these checks on pushes to `main` and pull requests targeting it:

| Check | Coverage |
| --- | --- |
| `npm --prefix client test` | Puzzle parsing, failed HTTP responses, and retry after a network error. |
| `npm --prefix server test` | API health, JSON responses for unknown routes, and signed-out access to game stats. |
| `npm --prefix client run build` | Production frontend build. |
| [Chromium gameplay](client/e2e/round.cjs) | Puzzle retry and timer recovery, plus one score-save request when time or lives run out. The browser test uses mock API responses. |

### Live-service checks before submission

1. Sign up with a test account, receive the Brevo OTP, verify the account, and sign in.
2. Play a round against the live Banana API. Refresh the profile and confirm the completed round is reflected in the stats.
3. Play with a second test account and confirm the leaderboard ranks both accounts by high score.

Record the actual results of these checks after running the app with a test database and mail configuration.
