import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import logger from '#config/logger.js';

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

app.get('/', (req, res) => {
  logger.info('Hello from Acquisition!');

  res.status(200).send('Hello from Acquisition');
});

export default app;
