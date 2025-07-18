import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendWelcomeEmail } from '../utils/mailer';
import { verifyGoogleToken } from '../utils/googleAuth';
import { AuthenticatedRequest, GoogleLoginRequestBody, GoogleUserData } from '../types/types';
import { sendThankYouEmail } from '../utils/googlemailer';

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET as string || 'default_secret';


export const googleLogin = async (
  req: Request<{}, {}, GoogleLoginRequestBody>,
  res: Response
): Promise<void> => {
  const { token } = req.body;

  try {
    const userData = await verifyGoogleToken(token) as GoogleUserData;

    if (!userData?.email) {
      res.status(400).json({ error: 'Invalid user data' });
      return;
    }

    let user = await prisma.user.findUnique({ where: { email: userData.email } });

    const isNewUser = !user;

    if (isNewUser) {
      user = await prisma.user.create({
        data: {
          username: userData.name ?? 'GoogleUser',
          email: userData.email,
          image: userData.picture,
          isVerified: true,
        },
      });

      // Send thank you email only for new users
      await sendThankYouEmail(user.email, user.username);
    }

    const jwtToken = jwt.sign(
      { userId: user?.id },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    res.json({ token: jwtToken, user });
    return;
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
    return;
  }
};

// signup function 
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password, image } = req.body as {
    username: string;
    email: string;
    password: string;
    image?: string;
  };

  if (!username || !email || !password) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, password: hashedPassword, image },
    });

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });

    const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

    await sendWelcomeEmail(email, verificationLink);

    res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email } });
  } catch (err) {
    res.status(400).json({ error: 'User with this email or username already exists' });
  }
};


// verifyEmail function
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body as { token: string };

  if (!token) {
    res.status(400).json({ error: 'Token is required' });
    return;
  }

  // console.log('verify email token', token);

  try {
    const decoded = jwt.verify(token, SECRET) as { userId: string };

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { isVerified: true },
    });

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('Email verification failed:', err);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};


// signin  function
export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.password) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  if (!user.isVerified) {
    res.status(403).json({ error: 'Please verify your email before signing in.' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1d' });
  res.json({ message: 'Login successful', token });
};


export const getUserProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.userId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        image: true,
        isVerified: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
