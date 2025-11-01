export interface User {
    _id: string;
    username: string;
    email: string;
}

export interface Message {
    _id?: string; // Optional for new messages before they are saved/assigned an ID
    user: string; // User ID
    username: string;
    text: string;
    timestamp: string; // ISO Date string
}

export interface AuthResponse {
    token: string;
    user: User;
}