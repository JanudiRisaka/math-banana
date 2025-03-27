// server/services/email.service.js
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import { googleAuth } from '../config/oauth.config.js';

const OAuth2 = google.auth.OAuth2;

// services/email.service.js
const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  });

  try {
    const { token } = await oauth2Client.getAccessToken();

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: token
      }
    });
  } catch (error) {
    throw new Error(`Failed to create transporter: ${error.message}`);
  }
};

export const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = await createTransporter();

    await transporter.sendMail({
      from: `"Math Banana" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <h2>Email Verification</h2>
        <p>Click to verify your email:</p>
        <a href="${process.env.BASE_URL}/verify-email?token=${token}">
          Verify Email
        </a>
        <p>Link expires in 1 hour</p>
      `
    });
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send verification email');
  }
};