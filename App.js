import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VoiceRecorder from './components/VoiceRecorder';
function App() {
  const [tasks, setTasks] = useState([]);
  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTranscriptionComplete = async (transcribedText) => {
    try {
      const response = await axios.post('http://localhost:5000/api/tasks', {
        text: transcribedText,
        completed: false
      });
      
      setTasks(prevTasks => [...prevTasks, response.data]);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="App">
      <VoiceRecorder onTranscriptionComplete={handleTranscriptionComplete} />
    </div>
  );
}

export default App;