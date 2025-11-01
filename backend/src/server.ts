import http from 'http';
import app from './app';
import connectDB from './config/db';
import { initSocket } from './services/socketService'; 

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

connectDB();

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
})