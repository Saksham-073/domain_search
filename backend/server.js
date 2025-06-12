const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { 
  sessionMiddleware,
  errorHandler,
  requestLogger,
  createRateLimiter
} = require('./middleware');
require('dotenv').config();

const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);
app.use(createRateLimiter({
  windowMs: 15 * 60 * 1000, 
  maxRequests: 100,          
  message: 'Too many requests from this IP, please try again later'
}));
app.use(sessionMiddleware);
app.use('/api', apiRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log('Database initialized');
});
