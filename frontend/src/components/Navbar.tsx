import React from 'react';

interface NavbarProps {
    currentUser?: string | null;
    onLogout: () => void;
    userCount: number;
    chatCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, userCount, chatCount }) => {
    return (
        <nav className="bg-linear-to-r from-blue-600 to-blue-800 p-4 text-white shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Realtime Chat</h1>
                <div className="flex items-center space-x-4">
                    {currentUser && (
                        <span className="text-lg">Welcome, <span className="font-semibold">{currentUser}</span>!</span>
                    )}
                    <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">Users Online: {userCount}</span>
                    <span className="text-sm bg-blue-700 px-3 py-1 rounded-full">Total Messages: {chatCount}</span>
                    <button
                        onClick={onLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;