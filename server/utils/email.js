// //utils.email.js
// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();
// const transporter = nodemailer.createTransport({
//   service: 'Gmail', // Use service name instead of manual config
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_PASS
//   }
// });

// // Test transporter connection
// transporter.verify((error) => {
//   if (error) {
//     console.error('SMTP connection error:', error);
//   } else {
//     console.log('SMTP server ready');
//   }
// });

// export const sendVerificationEmail = async (email, verificationLink) => {
//   try {
//     await transporter.sendMail({
// from: `"Math Banana" <${process.env.GMAIL_USER}>`,
//       to: email,
//       subject: 'Verify Your Email',
//       html: `Click <a href="${verificationLink}">here</a> to verify your email.`
//     });
//   } catch (error) {
//     console.error('Email sending failed:', error);
//     throw new Error('Failed to send verification email');
//   }
// };

// export const sendWelcomeEmail = async (email) => {
//   await transporter.sendMail({
//     from: `"Math Banana" <${process.env.EMAIL_USER}>`,
//     to: email,
//     subject: 'Welcome to Math Banana!',
//     html: '<p>Your account has been successfully verified!</p>'
//   });
// };
