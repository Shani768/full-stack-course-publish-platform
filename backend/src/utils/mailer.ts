import nodemailer from 'nodemailer';

// const verifyLink = 'http://localhost:5173/signin';

export const sendWelcomeEmail = async (toEmail: string, verificationLink: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"YourApp Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Welcome! Please Verify Your Email',
    text: `Thank you for registering. Please verify your email:\n\n${verificationLink}`,
    html: `
      <h2>Welcome to YourApp!</h2>
      <p>Thank you for registering. Please click the link below to verify your email:</p>
      <a href="${verificationLink}" style="display:inline-block; padding:10px 20px; background-color:#007bff; color:white; text-decoration:none; border-radius:5px;">Verify Email</a>
      <p>If that doesn't work, copy and paste this link into your browser:</p>
      <p>${verificationLink}</p>
    `,
  });
};
