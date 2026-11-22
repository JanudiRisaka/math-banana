import 'dotenv/config';
import app from './app.js';
import connectDB from './config/mongodb.js';

const port = process.env.PORT || 5000;

await connectDB();
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
