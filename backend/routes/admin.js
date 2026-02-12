const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Task = require('../models/Task');
const Announcement = require('../models/Announcement');
const Schedule = require('../models/Schedule');

// Create an announcement
router.post('/announcements', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const announcement = new Announcement({ title, description });
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ message: 'Failed to create announcement.' });
  }
});

// Get all announcements
router.get('/announcements', authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ message: 'Failed to fetch announcements.' });
  }
});

// Update an announcement
router.put('/announcements/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );
    if (!announcement) return res.status(404).json({ message: 'Announcement not found.' });
    res.json(announcement);
  } catch (err) {
    console.error('Error updating announcement:', err);
    res.status(500).json({ message: 'Failed to update announcement.' });
  }
});

// Delete an announcement
router.delete('/announcements/:id', authMiddleware, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Announcement deleted successfully.' });
  } catch (err) {
    console.error('Error deleting announcement:', err);
    res.status(500).json({ message: 'Failed to delete announcement.' });
  }
});

// Get all users
router.get('/users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Fetch dashboard statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalVolunteers = await User.countDocuments({ role: 'volunteer' });
    const activeTasks = await Task.countDocuments({ status: 'active' });
    const upcomingSchedules = await Schedule.countDocuments({ date: { $gte: new Date() } });

    res.json({ totalVolunteers, activeTasks, upcomingSchedules });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

// Get all volunteers
router.get('/volunteers', authMiddleware, async (req, res) => {
  try {
    const volunteers = await User.find({ role: 'volunteer' });
    res.json(volunteers);
  } catch (err) {
    console.error('Error fetching volunteers:', err);
    res.status(500).json({ message: 'Failed to fetch volunteers.' });
  }
});
 

// Fetch tasks and filter by location
router.get('/tasks', authMiddleware, async (req, res) => {
  const { location } = req.query;
  try {
    const query = location ? { location } : {}; // Filter by location if provided
    const tasks = await Task.find(query)
      .populate('postedBy', 'name email')
      .populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
});
// Create a new task
router.post('/tasks', authMiddleware, async (req, res) => {
  const { name, description, location, dueDate, assignedTo } = req.body;

  try {
    const task = new Task({
      name,
      description,
      location,
      dueDate,
      assignedTo,
      postedBy: req.user.id, // Automatically set the logged-in user as postedBy
    });

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Failed to create task' });
  }
});
// Assign a task to a volunteer
router.put('/tasks/assign/:taskId', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    const taskId = req.params.taskId;
    const adminId = req.user.id; // Ensure the admin assigning the task is stored

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required for task assignment.' });
    }

    task.assignedTo = userId;
    task.postedBy = task.postedBy || adminId; // Set postedBy if not already set
    await task.save();

    res.status(200).json({ message: 'Task assigned successfully.', task });
  } catch (err) {
    console.error('Error assigning task:', err);
    res.status(500).json({ message: 'Failed to assign task.' });
  }
});

/**
 * PUT /api/admin/tasks/:id
 * Update an existing task
 */
router.put('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ message: 'Failed to update task' });
  }
});

/**
 * DELETE /api/admin/tasks/:id
 * Delete a task
 */
router.delete('/tasks/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ message: 'Failed to delete task' });
  }
});


// Fetch all schedules
router.get('/schedules', authMiddleware, async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .populate('assignedTo', 'name email'); // Populate with user name and email
    res.json(schedules);
  } catch (err) {
    console.error('Error fetching schedules:', err);
    res.status(500).json({ message: 'Failed to fetch schedules' });
  }
});

// Create a new schedule
router.post('/schedules', authMiddleware, async (req, res) => {
  const { name, date, description } = req.body;

  try {
    const schedule = new Schedule({ name, date, description });
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    console.error('Error creating schedule:', err);
    res.status(500).json({ message: 'Failed to create schedule' });
  }
});

// Delete a schedule
router.delete('/schedules/:id', authMiddleware, async (req, res) => {
  try {
    await Schedule.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (err) {
    console.error('Error deleting schedule:', err);
    res.status(500).json({ message: 'Failed to delete schedule' });
  }
});

// Assign a schedule to volunteers
router.put('/schedules/assign/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { assignedTo } = req.body; // Array of user IDs

  try {
    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { assignedTo },
      { new: true }
    ).populate('assignedTo', 'name email'); // Populate assigned users
    res.json(schedule);
  } catch (err) {
    console.error('Error assigning schedule:', err);
    res.status(500).json({ message: 'Failed to assign schedule' });
  }
});


module.exports = router;
