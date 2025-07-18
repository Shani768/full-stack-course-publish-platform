import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/userRoutes';
import courseRoutes from './routes/courseRoute'
import chapterRoutes from './routes/chapterRoutes'
import rateLimiter from './middlewares/rateLimiter';


dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Apply rate limiter globally
app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chapters', chapterRoutes)

// Health check or home route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
