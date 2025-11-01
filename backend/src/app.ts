import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import { getConnectedUserCount } from './services/socketService';
import Message from './models/Message';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL })); 
app.use(express.json())

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/api/chat/counts', async (req, res) => {
    try {
        const totalUsers = getConnectedUserCount(); // Get real-time connected users from socket service
        const totalChats = await Message.countDocuments();
        res.json({ totalUsers, totalChats });
    } catch (error) {
        console.error('Error fetching chat counts:', error);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;