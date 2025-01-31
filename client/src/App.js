import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import VoiceRecorder from './components/VoiceRecorder';
import TaskList from './components/TaskList';
import './styles/App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`);
      const data = await response.json();
      const sortedTasks = data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setTasks(sortedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks', {
        theme: 'dark'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranscriptionComplete = async (text) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text,
          timestamp: new Date().toISOString()
        }),
      });
      
      const newTask = await response.json();
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      toast.success('Task added successfully', {
        theme: 'dark'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task', {
        theme: 'dark'
      });
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      
      setTasks((prevTasks) => prevTasks.filter(task => task._id !== taskId));
      toast.success('Task deleted successfully', {
        theme: 'dark'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task', {
        theme: 'dark'
      });
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Voice Task Manager</h1>
        <p className="subtitle">Speak your tasks into existence</p>
      </header>
      
      <main className="app-main">
        <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
        
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>Loading your tasks...</p>
          </div>
        ) : (
          <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />
        )}
      </main>

      <ToastContainer 
        position="bottom-right"
        theme="dark"
        autoClose={3000}
      />
    </div>
  );
}

export default App;