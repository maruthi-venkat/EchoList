# Voice Task Manager

A MERN stack application that allows users to create tasks using voice commands. The application uses the Deepgram API for speech-to-text conversion and provides a simple interface for managing tasks.

## Features

- Voice-to-text task creation
- Real-time task management
- Responsive design
- MongoDB persistence

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Deepgram API key

## Environment Variables

### Client (.env)
REACT_APP_API_URL=http://localhost:5000

### Server (.env)
PORT=5000 
MONGODB_URI=mongodb://localhost:27017/voice-tasks 
DEEPGRAM_API_KEY=your_deepgram_api_key


## Local Development

1. Clone the repository:
bash
git clone https://github.com/yourusername/voice-task-manager.git
cd EchoList

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

# Start the client (in client directory)
npm start

# Start the server (in server directory)
npm run dev

Access the application at http://localhost:3000

# API Endpoints
GET /api/tasks - Get all tasks
POST /api/tasks - Create a new task
DELETE /api/tasks/:id - Delete a task

# Technology Stack

Frontend:
React.js
React Hooks
CSS3
React-Toastify

Backend:
Node.js
Express.js
MongoDB
Mongoose
Deepgram API

Deployment:
vercel(for frontend)
render(for backend)

License
This project is licensed under the MIT License - see the LICENSE file for details.
