import express from 'express';
import { sendVerificationEmail } from '../services/email.service.js';

const router = express.Router();

router.get('/test-email', async (req, res) => {
  try {
    await sendVerificationEmail('recipient@email.com', 'test-token');
    res.send('Email sent successfully');
  } catch (error) {
    res.status(500).send(`Email failed: ${error.message}`);
  }
});

export default router;