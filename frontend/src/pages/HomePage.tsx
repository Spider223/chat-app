import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { type Message } from '../types';
import { getSocket } from '../services/socket';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [userCount, setUserCount] = useState<number>(0);
    const [chatCount, setChatCount] = useState<number>(0);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const [socketError, setSocketError] = useState<string | null>(null);

    useEffect(() => {
        if (!auth?.isAuthenticated || !auth.token) {
            console.log('Not authenticated, redirecting to login...');
            navigate('/login');
            return;
        }

        let socket;
        try {
            socket = getSocket();
            setSocketError(null); // Clear previous errors if connection is successful
        } catch (error: any) {
            console.error("Failed to initialize socket:", error.message);
            setSocketError(error.message);
            // If socket initialization fails due to missing token, AuthContext should handle logout/redirect.
            return;
        }

        socket.on('chatHistory', (history: Message[]) => {
            setMessages(history);
        });

        socket.on('newMessage', (message: Message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        socket.on('userCountUpdate', (count: number) => {
            setUserCount(count);
        });

        socket.on('chatCountUpdate', (count: number) => {
            setChatCount(count);
        });

        socket.on('userJoined', (username: string) => {
            console.log(`${username} joined the chat.`);
            setMessages((prevMessages) => [...prevMessages, {
                _id: `sys-${Date.now()}-join`,
                user: 'system',
                username: 'System',
                text: `${username} joined the chat.`,
                timestamp: new Date().toISOString()
            }]);
        });

        socket.on('userLeft', (username: string) => {
            console.log(`${username} left the chat.`);
            setMessages((prevMessages) => [...prevMessages, {
                _id: `sys-${Date.now()}-left`,
                user: 'system',
                username: 'System',
                text: `${username} left the chat.`,
                timestamp: new Date().toISOString()
            }]);
        });

        socket.on('errorMessage', (error: string) => {
            console.error('Socket error from server:', error);
            setSocketError(error); // Display server-side socket errors
        });


        return () => {
            // Clean up socket listeners when component unmounts
            socket?.off('chatHistory');
            socket?.off('newMessage');
            socket?.off('userCountUpdate');
            socket?.off('chatCountUpdate');
            socket?.off('userJoined');
            socket?.off('userLeft');
            socket?.off('errorMessage');
            // We don't disconnect the socket here because we want it to persist across route changes
            // if the user stays authenticated and navigates back to chat.
            // Disconnect is handled on explicit logout.
        };
    }, [auth?.isAuthenticated, auth?.token, navigate]); // Add navigate to dependency array

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    }, [messages]);


    const handleSendMessage = (text: string) => {
        if (text.trim() && auth?.token) {
            try {
                getSocket().emit('sendMessage', text);
            } catch (error: any) {
                console.error("Failed to send message via socket:", error.message);
                setSocketError("Could not send message. Socket not connected or authenticated.");
            }
        }
    };

    if (!auth?.isAuthenticated) {
        // This case should be handled by the navigate('/login') above, but as a fallback:
        return <div className="flex items-center justify-center h-screen text-xl text-red-500">Please log in to access the chat.</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Navbar currentUser={auth.user?.username} onLogout={auth.logout} userCount={userCount} chatCount={chatCount} />
            <div className="grow p-4 overflow-hidden">
                {socketError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{socketError}</span>
                    </div>
                )}
                <ChatWindow messages={messages} chatWindowRef={chatWindowRef} currentUserId={auth.user?._id} />
            </div>
            <div className="p-4 bg-white border-t border-gray-200">
                <MessageInput onSendMessage={handleSendMessage} />
            </div>
        </div>
    );
};

export default HomePage;