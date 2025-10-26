import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_DB_URI;

// --- Middleware ---
app.use(express.json());

// --- Dynamic CORS configuration ---
const devOrigin = 'http://localhost:5173'; // your local frontend
const prodOrigin = 'https://u-fit-one.vercel.app'; // your deployed frontend

const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [prodOrigin] 
  : [devOrigin];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected successfully! 🚀');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
connectDB();

// --- Routes ---
app.use('/api/auth', authRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
