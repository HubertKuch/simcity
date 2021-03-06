import express from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import helmet from "helmet";
import errorController from './controllers/errorController';
import userRouter from './routes/userRouter';
import buildingRouter from './routes/buildingRouter';
import logger from './utils/logger';
import rateLimit from 'express-rate-limit';
import viewRouter from './routes/viewRouter';
import cookieParser from 'cookie-parser';
import headersMiddleware from './middleware/headers';

const app = express();

// CONFIG
config();
app.set('view engine', 'pug');

// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(express.static('public'));
app.use(logger);
app.use(headersMiddleware);

// RATE LIMITER
if (process.env.NODE_ENV === 'production') {
  app.use(
    '/api',
    rateLimit({
      max: 150,
      windowMs: 60 * 60 * 1000,
      message: 'Too many request. Try again in an one hour.',
    })
  );
}

// ROUTES
app.use('/', viewRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/buildings/', buildingRouter);
app.use(errorController);

// MONGO
let dbConnectionString = `${process.env.DB_URI}`
  .replace('<user>', process.env.DB_USER ?? '')
  .replace('<password>', process.env.DB_PASS ?? '');

connect(dbConnectionString, {});

export default app;
