import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Message, { IMessage } from '../models/Message';
import dotenv from 'dotenv';

dotenv.config();

interface AuthenticatedSocket extends Socket {
    user?: { id: string; username: string };
}

let io: SocketIOServer;
const connectedUsernames = new Set<string>(); // Store usernames of connected users

export const initSocket = (httpServer: any) => {
    io = new SocketIOServer(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ['GET', 'POST'],
        },
    });

    // Socket.IO middleware for authentication
    io.use(async (socket: AuthenticatedSocket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: No token provided.'));
        }
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
            const user = await User.findById(decoded.id).select('-password');
            if (!user) {
                return next(new Error('Authentication error: User not found.'));
            }
            socket.user = { id: String(user._id), username: user.username };
            next();
        } catch (error) {
            return next(new Error('Authentication error: Invalid token.'));
        }
    });

    io.on('connection', async (socket: AuthenticatedSocket) => {
        const username = socket.user?.username;
        if (username) {
            console.log(`User connected: ${username} (${socket.id})`);
            connectedUsernames.add(username);

            // Emit total users and chat counts to ALL clients
            io.emit('userCountUpdate', connectedUsernames.size);
            const totalMessages = await Message.countDocuments();
            io.emit('chatCountUpdate', totalMessages);

            // Broadcast new user joined (excluding the current user)
            socket.broadcast.emit('userJoined', username);

            // Fetch chat history for the newly connected user
            const chatHistory = await Message.find()
                .sort({ timestamp: 1 })
                .limit(50); // Fetch last 50 messages
            socket.emit('chatHistory', chatHistory);
        } else {
            socket.emit('errorMessage', 'Authentication failed, please log in again.');
            socket.disconnect(true); // Disconnect if user data is missing after auth middleware
            return;
        }


        socket.on('sendMessage', async (messageText: string) => {
            if (!socket.user) {
                socket.emit('errorMessage', 'You are not authenticated to send messages.');
                return;
            }
            if (!messageText || messageText.trim().length === 0) {
                socket.emit('errorMessage', 'Message cannot be empty.');
                return;
            }

            try {
                const newMessage: IMessage = new Message({
                    user: socket.user.id,
                    username: socket.user.username,
                    text: messageText,
                });
                await newMessage.save();

                // Emit the new message to all connected clients
                io.emit('newMessage', {
                    _id: newMessage._id, // Include _id for unique keys in frontend
                    user: socket.user.id,
                    username: socket.user.username,
                    text: messageText,
                    timestamp: newMessage.timestamp.toISOString(), // Send as ISO string
                });

                // Update total chat counts for all clients
                const updatedTotalMessages = await Message.countDocuments();
                io.emit('chatCountUpdate', updatedTotalMessages);

            } catch (error) {
                console.error('Error saving message:', error);
                socket.emit('errorMessage', 'Failed to send message.');
            }
        });

        socket.on('disconnect', () => {
            const disconnectedUsername = socket.user?.username;
            if (disconnectedUsername) {
                console.log(`User disconnected: ${disconnectedUsername} (${socket.id})`);
                connectedUsernames.delete(disconnectedUsername);
                io.emit('userCountUpdate', connectedUsernames.size);
                socket.broadcast.emit('userLeft', disconnectedUsername);
            }
        });
    });

    console.log('Socket.IO initialized.');
    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized!');
    }
    return io;
};

// Function to get current user count (for REST API if needed, though socket emits are preferred for real-time)
export const getConnectedUserCount = () => connectedUsernames.size;