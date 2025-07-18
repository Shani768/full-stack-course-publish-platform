import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyGoogleToken } from '../utils/googleAuth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/google', async (req, res) => {
  const { token } = req.body;

  try {
    const userData = await verifyGoogleToken(token);
    console.log('user server data', userData)

    if (!userData?.email) return res.status(400).json({ error: 'Invalid user data' });

    // Check or create user
    let user = await prisma.user.findUnique({ where: { email: userData.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
        },
      });
    }

    // Generate JWT
    const jwtToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    res.json({ token: jwtToken, user });
  } catch (err) {
    res.status(500).json({ error: 'Authentication failed' });
  }
});

export default router;
