import express from 'express';
import Task from '../models/Task.js';

const router = express.Router();

/**
 * Get all tasks
 * @route GET /api/tasks
 */
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ timestamp: -1 });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

/**
 * Create new task
 * @route POST /api/tasks
 */
router.post('/', async (req, res) => {
  try {
    const task = new Task({
      text: req.body.text,
      timestamp: new Date()
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Error creating task' });
  }
});

/**
 * Delete task
 * @route DELETE /api/tasks/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

export default router;