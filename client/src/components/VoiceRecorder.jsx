import React, { useState, useCallback } from 'react';
import { Mic } from 'lucide-react';
import { toast } from 'react-toastify';

const VoiceRecorder = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', audioBlob);
      
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/transcribe`, {
            method: 'POST',
            body: formData,
          });
      
          const data = await response.json();
      
          if (!response.ok) {
            // Handle specific error cases
            if (response.status === 400) {
              toast.info('No words, no task! Try speaking to add it.', {
                theme: 'dark'
              });
            } else {
              toast.error('Error processing audio. Please try again.', {
                theme: 'dark'
              });
            }
            return;
          }
      
          if (!data.text || data.text.trim().length === 0) {
            toast.info('No words, no task! Try speaking to add it.', {
              theme: 'dark'
            });
            return;
          }
      
          onTranscriptionComplete(data.text);
      
        } catch (error) {
          console.error('Transcription error:', error);
          toast.info('No words, no task! Try speaking to add it.', {
            theme: 'dark'
          });
        } finally {
          stream.getTracks().forEach(track => track.stop());
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      toast.info('Recording started...', {
        theme: 'dark',
        autoClose: 2000
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone. Please check your permissions.', {
        theme: 'dark'
      });
    }
  }, [onTranscriptionComplete]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
      toast.info('Processing your speech...', {
        theme: 'dark',
        autoClose: 2000
      });
    }
  }, [mediaRecorder]);

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="voice-recorder">
      <button 
        className={`record-button ${isRecording ? 'recording' : ''}`}
        onClick={toggleRecording}
        aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
      >
        <Mic className="mic-icon" size={24} />
        <span className="record-text">
          {isRecording ? 'Recording...' : 'Record Task'}
        </span>
      </button>
      <p className="record-hint">
        {isRecording 
          ? 'Speak clearly into your microphone' 
          : 'Click to start recording your task'}
      </p>
    </div>
  );
};

export default VoiceRecorder;