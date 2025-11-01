import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import logger from '#config/logger.js';
import authRoutes from '#routes/auth.routes.js';
import securityMiddleware from '#middleware/security.middleware.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) }, // Combining both our logging library that is winston and morgan. by passing over morgan messages into our logger
  })
);

app.use(securityMiddleware);

app.get('/', (req, res) => {
  logger.info('Hello from Acquisition!');

  res.status(200).send('Hello from Acquisition');
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Acquisition API is running!' });
});

app.use('/api/auth', authRoutes);

export default app;
