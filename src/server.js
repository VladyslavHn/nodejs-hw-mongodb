import cors from 'cors';
import pino from 'pino';
import expressPino from 'express-pino-logger';
import { env } from "./utils/env.js";
import express from 'express';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import contactsRouter from './routers/contacts.js';
import cookieParser from 'cookie-parser';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();
    app.use(cors());

 app.use(cookieParser());

    const logger = pino({
        transport: {
            target: 'pino-pretty',
        }
    });

        app.use(express.json());

    app.use(expressPino({ logger }));

    app.use(contactsRouter)

    app.use('*', notFoundHandler);
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
