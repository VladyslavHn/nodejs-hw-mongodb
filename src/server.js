import cors from 'cors';
import pino from 'pino';
import expressPino from 'express-pino-logger';
import { env } from "./utils/env.js";
import express from 'express';
import { getContacts, getContactById } from "./services/services.js";
import mongoose from 'mongoose';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();
    app.use(cors());

    // Створення логера
    const logger = pino({
        transport: {
            target: 'pino-pretty',
        }
    });

    // Використання middleware express-pino-logger
    app.use(expressPino({ logger }));

    app.get('/contacts', async (req, res) => {
        const contacts = await getContacts();
        res.status(200).json({
            status: 'OK',
            message: 'Contacts found',
            data: contacts
        })
    });

    app.get('/contacts/:id', async (req, res) => {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) { 
            return res.status(400).json({
                message: 'Not found'
            });
        }
        const contact = await getContactById(id);
        
        if (!contact) {
            return res.status(404).json({
                message: 'Not found contact with this id'
            });
        }
        
        res.status(200).json({
            status: 'OK',
            message: 'Contact found',
            data: contact
        });
    });

    app.use('*', (req, res) => {
        res.status(404).json({
            message: 'Not found'
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
