import React from 'react';
import { type Message } from '../types';

interface ChatWindowProps {
    messages: Message[];
    chatWindowRef: React.RefObject<HTMLDivElement>;
    currentUserId?: string; // To differentiate user's own messages
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, chatWindowRef, currentUserId }) => {
    return (
        <div ref={chatWindowRef} className="flex flex-col h-full overflow-y-auto p-4 space-y-2 bg-white rounded-lg shadow-md">
            {messages.map((msg, index) => (
                <div
                    key={msg._id || index}
                    className={`flex ${msg.user === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.user === currentUserId
                                ? 'bg-blue-500 text-white'
                                : msg.user === 'system'
                                    ? 'bg-gray-300 text-gray-800 text-sm italic'
                                    : 'bg-gray-200 text-gray-800'
                        }`}
                    >
                        {msg.user !== currentUserId && msg.user !== 'system' && (
                            <span className="font-bold text-sm block mb-1">{msg.username}</span>
                        )}
                        <p className={`${msg.user === 'system' ? 'text-sm' : ''}`}>{msg.text}</p>
                        <span className={`text-xs block text-right mt-1 ${msg.user === currentUserId ? 'text-blue-200' : 'text-gray-500'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ChatWindow;