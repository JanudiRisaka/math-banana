// This file configures the Nodemailer transporter for sending emails.
import nodemailer from 'nodemailer';

// Create a transporter using SMTP settings from environment variables
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default transporter;