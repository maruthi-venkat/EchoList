# Voice Task Manager

A MERN stack application that allows users to create tasks using voice commands. The application uses the Deepgram API for speech-to-text conversion and provides a simple interface for managing tasks.

## Features

- Voice-to-text task creation
- Real-time task management
- Responsive design
- Docker containerization
- MongoDB persistence

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker and Docker Compose (for containerized deployment)
- Deepgram API key

## Environment Variables

### Client (.env)
REACT_APP_API_URL=http://localhost:5000





### Server (.env)
PORT=5000 MONGODB_URI=mongodb://localhost:27017/voice-tasks DEEPGRAM_API_KEY=your_deepgram_api_key


## Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/voice-task-manager.git
cd voice-task-manager
Install dependencies:
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
Start the development servers:
# Start the client (in client directory)
npm start

# Start the server (in server directory)
npm run dev
Docker Deployment
Build and run the containers:
docker-compose up --build
Access the application at http://localhost
API Endpoints
GET /api/tasks - Get all tasks
POST /api/tasks - Create a new task
DELETE /api/tasks/:id - Delete a task
POST /api/speech - Convert speech to text
Technology Stack
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
Docker
Nginx
Docker Compose
Contributing
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
License
This project is licensed under the MIT License - see the LICENSE file for details.