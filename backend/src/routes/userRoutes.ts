import { Router } from 'express';
import { signup, signin,verifyEmail,googleLogin, getUserProfile } from '../controllers/userController';
import { verifyToken } from '../middlewares/authMiddleware';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/verify-email', verifyEmail);
router.get('/user', verifyToken, getUserProfile);
// @ts-ignore
router.post('/google', googleLogin);



export default router;
