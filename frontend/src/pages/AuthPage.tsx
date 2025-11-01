import React, { useState } from 'react';
import AuthForm from '../components/AuthForm';

const AuthPage: React.FC = () => {
    const [isRegister, setIsRegister] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="bg-linear-to-br from-blue-700 to-indigo-900 p-8 rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out max-w-lg w-full">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-white mb-4">Welcome to Realtime Chat</h1>
                    <p className="text-blue-100 text-lg">Join the conversation now!</p>
                </div>

                <AuthForm isRegister={isRegister} />

                <div className="text-center mt-6 text-white">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-blue-200 hover:text-blue-50 font-medium transition duration-200 ease-in-out"
                    >
                        {isRegister
                            ? 'Already have an account? Login here.'
                            : "Don't have an account? Register here."}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;