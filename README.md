# Full-Stack Chat Application

This is a real-time chat application built with **React (Vite + TypeScript) frontend**, **Node.js + Express backend**, **MongoDB**, and **Socket.IO** for real-time messaging.

---

## Features
- User authentication (JWT)
- Real-time messaging with Socket.IO
- Online user count
- Chat history
- Simple UI with Tailwind CSS

## Prerequisites
- Node.js >= 18
- npm or yarn
- MongoDB database
- Optional: Postman for API testing

---
## Environment Variables

Create a `.env` file in the **backend** folder with:

- PORT=4000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- FRONTEND_URL=http://localhost:5173

Create a `.env` file in the **frontend** folder with:

- VITE_REACT_APP_BACKEND_URL=http://localhost:4000

---

## Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
``` bash
npm install
```

3. Start the server (development mode):
```bash
npm start
```

--

## Frontend Setup

1. Navigate to the Frontend folder:
```bash
cd frontend
```

2. Install dependencies:
``` bash
npm install
```

3. Start the server (development mode):
```bash
npm run dev
```
  
