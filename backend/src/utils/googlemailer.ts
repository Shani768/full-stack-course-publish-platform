// utils/mailer.ts
import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});

export const sendThankYouEmail = async (to: string, username: string) => {
  await transporter.sendMail({
    from: `"Your App Name" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: 'Thanks for signing in!',
    html: `
      <h3>Hello ${username},</h3>
      <p>Thanks for signing in our website. We're happy to have you here!</p>
      <p>— The Team</p>
    `,
  });
};
