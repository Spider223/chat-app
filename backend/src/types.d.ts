import { Request } from 'express';

// Extend the Request interface to include a user property
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                username: string;
            };
        }
    }
}