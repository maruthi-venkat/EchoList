import React, { useState, useRef } from 'react';
import axios from 'axios';
import './VoiceRecorder.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const VoiceRecorder = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        await handleAudioUpload(audioBlob);
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioUpload = async (audioBlob) => {
    try {
      console.log('Audio blob size:', audioBlob.size);
      console.log('Audio blob type:', audioBlob.type);

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');

      const response = await axios.post(`${API_URL}/api/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('Server response:', response.data);

      if (response.data && response.data.text) {
        onTranscriptionComplete(response.data.text);
      }
    } catch (error) {
      console.error('Error uploading audio:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  return (
    <div className="voice-recorder">
      <button 
      onClick={isRecording ? stopRecording : startRecording}
        className={isRecording ? 'recording' : ''}
    >
      {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {isRecording && <div className="recording-indicator">Recording...</div>}
    </div>
  );
};

export default VoiceRecorder;
