import express from 'express';
import multer from 'multer';
import deepgramSDK from '@deepgram/sdk';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Task from './models/Task.js';
import { Readable } from 'stream';

const { Deepgram } = deepgramSDK;

// Configure __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Configure Multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// GET all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ timestamp: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Create task
app.post('/api/tasks', async (req, res) => {
  try {
    // Check if text is empty or only contains whitespace
    if (!req.body.text || req.body.text.trim().length === 0) {
      return res.status(400).json({
        error: 'No words, no task! Try speaking to add it.'
      });
    }

    const task = new Task({
      text: req.body.text.trim(), // Remove extra whitespace
      timestamp: req.body.timestamp || new Date().toISOString()
    });
    
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// Transcribe audio
app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file provided' });
    }

    const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY);

    const source = {
      buffer: req.file.buffer,
      mimetype: req.file.mimetype
    };

    const options = {
      model: 'nova-2',
      language: 'en-US',
      smart_format: true,
    };

    const response = await deepgram.transcription.preRecorded(source, options);

    if (response?.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
      const transcript = response.results.channels[0].alternatives[0].transcript.trim();

      if (transcript.length === 0) {
        return res.status(400).json({
          error: 'No speech detected'
        });
      }

      res.json({ text: transcript });
    } else {
      return res.status(400).json({
        error: 'No speech detected'
      });
    }
  } catch (error) {
    console.error('Transcription error:', error);
    return res.status(400).json({
      error: 'No speech detected'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});