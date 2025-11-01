import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
    if (!socket) {
        const token = localStorage.getItem('token');
        if (!token) {
            // Throwing an error here so AuthContext can catch it and handle logout/redirect
            throw new Error('No authentication token found. Please log in.');
        }

        socket = io('http://localhost:4000', {
            auth: {
                token: token,
            },
            transports: ['websocket', 'polling'], // Ensure proper transport methods
        });

        console.log("scokett", socket);

        socket.on('connect', () => {
            console.log('Connected to Socket.IO server');
        });

        socket.on('disconnect', (reason) => {
            console.log('Disconnected from Socket.IO server:', reason);
            // Optionally handle specific reasons, e.g., if token invalidated by server
            if (reason === 'io server disconnect' || reason === 'transport close') {
                // This might indicate an authentication issue or server restart.
                // You might want to trigger a re-authentication flow or a full logout.
            }
        });

        socket.on('connect_error', (error) => {
            console.error('Socket.IO connection error:', error.message);
            if (error.message.includes('Authentication error')) {
                console.warn('Socket.IO auth error, attempting logout...');
                // Trigger a logout if auth fails on socket connection
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login'; // Redirect to login
            }
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        console.log('Disconnecting Socket.IO client.');
        socket.disconnect();
        socket = null;
    }
};