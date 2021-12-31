import express, { NextFunction, Request, Response } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv'
import helmet from 'helmet';
import errorController from "./controllers/error.controller";
import userRouter from "./routes/user.router";
import buildingRouter from "./routes/building.router";
import logger from "./utils/logger";
import rateLimit from 'express-rate-limit';
import viewRouter from './routes/view.router';

config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug');
app.use(express.static('public'))
app.use(logger);

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src *; font-src *;"
      );

    next();
});

if (process.env.NODE_ENV === 'production') {
    app.use('/api', rateLimit({
        max: 150,
        windowMs: 60 * 60 * 1000,
        message: 'Too many request. Try again in an one hour.'
    }));
}

app.use('/', viewRouter);
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/buildings/', buildingRouter);

app.use(errorController);

let db = `${process.env.DB_URI}`
    .replace('<user>', process.env.DB_USER??'')
    .replace('<password>', process.env.DB_PASS??'');

connect(db, {});

export default app;
