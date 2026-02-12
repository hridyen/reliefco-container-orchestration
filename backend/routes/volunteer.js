const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Import bcrypt
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Task = require('../models/Task');
const Schedule = require('../models/Schedule');
const Announcement = require('../models/Announcement');

const Update = require('../models/Update'); // If updates are stored in the DB


router.get('/volunteer/announcements', authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }); // Fetch all announcements
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ message: 'Failed to fetch announcements.' });
  }
});

// Fetch all announcements for volunteers
router.get('/announcements', authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }); // Ensure the Announcement model exists
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ message: 'Failed to fetch announcements.' });
  }
});

/**
 * GET /api/volunteer/overview
 * Fetch stats for the volunteer dashboard overview.
 */
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Count completed tasks
    const tasksCompleted = await Task.countDocuments({ completedBy: userId, status: 'done' });

    // Count upcoming tasks (for example, based on due date)
    const upcomingTasks = await Task.countDocuments({ assignedTo: userId, status: 'active' });

    // Calculate total hours (e.g., assume 2 hours per task)
    const totalHours = tasksCompleted * 2;

    res.json({ tasksCompleted, upcomingTasks, totalHours });
  } catch (err) {
    console.error('Error fetching overview data:', err);
    res.status(500).json({ message: 'Failed to fetch overview data.' });
  }
});


/**
 * GET /api/volunteer/profile
 * Fetch the profile of the currently logged-in volunteer.
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * PUT /api/volunteer/profile
 * Update the profile of the currently logged-in volunteer.
 */
router.put('/profile', authMiddleware, async (req, res) => {
  const { name, email, mobileNumber, location } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, mobileNumber,location },
      { new: true, runValidators: true } // Return the updated document
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/change-password', authMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
  
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });
  
      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
  
      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
/**
 * GET /api/volunteer/tasks
 * Fetch tasks assigned to the volunteer.
 */
router.get('/tasks', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ assignedTo: userId, status: { $ne: 'done' } }); // Exclude completed tasks
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
});

/**
 * GET /api/volunteer/updates
 * Fetch updates/announcements for volunteers.
 */
router.get('/updates', authMiddleware, async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }); // Fetch all announcements
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching updates:', err);
    res.status(500).json({ message: 'Failed to fetch updates.' });
  }
});

/**
 * POST /api/volunteer/tasks/done/:taskId
 * Mark a task as done
 */
router.post('/tasks/done/:taskId', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Find the task and mark it as done
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (task.status === 'done') {
      return res.status(400).json({ message: 'Task is already marked as done.' });
    }

    task.status = 'done';
    task.completedBy = userId; // Track which user completed the task
    await task.save();

    // Calculate completed tasks
    const tasksCompleted = await Task.countDocuments({ completedBy: userId, status: 'done' });

    res.status(200).json({ message: 'Task marked as done.', tasksCompleted });
  } catch (err) {
    console.error('Error marking task as done:', err);
    res.status(500).json({ message: 'Failed to mark task as done.' });
  }
});

router.post('/tasks/complete/:taskId', authMiddleware, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Find and validate the task
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    if (task.status === 'done') {
      return res.status(400).json({ message: 'Task is already completed.' });
    }

    // Update task status and assign completion
    task.status = 'done';
    task.completedBy = userId;
    await task.save();

    // Count updated tasks
    const tasksCompleted = await Task.countDocuments({ completedBy: userId, status: 'done' });

    res.status(200).json({ message: 'Task marked as completed.', tasksCompleted });
  } catch (err) {
    console.error('Error marking task as completed:', err);
    res.status(500).json({ message: 'Failed to mark task as completed.' });
  }
});


/**
 * GET /api/volunteer/schedule
 * Fetch schedule for the logged-in volunteer
 */
router.get('/schedule', authMiddleware, async (req, res) => {
  try {
    const schedule = await Schedule.find({ assignedTo: req.user.id });
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Failed to fetch schedule' });
  }
});

// Fetch tasks picked by the logged-in volunteer
router.get('/picked-tasks', authMiddleware, async (req, res) => {
  try {
    const volunteerId = req.user.id;

    // Fetch tasks where the volunteer has picked them and they are still active
    const pickedTasks = await Task.find({ assignedTo: volunteerId, status: 'picked' })
      .populate('postedBy', 'name email');

    res.status(200).json(pickedTasks);
  } catch (err) {
    console.error('Error fetching picked tasks:', err);
    res.status(500).json({ message: 'Failed to fetch your picked tasks.' });
  }
});



router.post('/schedule', authMiddleware, async (req, res) => {
  const { taskId } = req.body;
  const volunteerId = req.user.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    if (task.isScheduled) return res.status(400).json({ message: 'Task is already scheduled.' });

    // Add task to volunteer's schedule
    const schedule = new Schedule({
      name: task.name,
      description: task.description,
      location: task.location,
      date: task.dueDate,
      assignedTo: volunteerId,
    });
    await schedule.save();

    // Update the task to mark it as scheduled
    task.isScheduled = true;
    await task.save();

    res.status(200).json({ message: 'Task scheduled successfully.', schedule });
  } catch (err) {
    console.error('Error scheduling task:', err);
    res.status(500).json({ message: 'Failed to schedule task.' });
  }
});

// DELETE /api/volunteer/schedule/:eventId
router.delete('/schedule/:eventId', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.params;

    const deletedSchedule = await Schedule.findByIdAndDelete(eventId);

    if (!deletedSchedule) {
      return res.status(404).json({ message: 'Scheduled task not found.' });
    }

    res.status(200).json({ message: 'Scheduled task deleted successfully.' });
  } catch (err) {
    console.error('Error deleting schedule:', err);
    res.status(500).json({ message: 'Failed to delete scheduled task.' });
  }
});


// Move Scheduled Task to My Tasks
router.post('/move-to-my-tasks', authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;
    const volunteerId = req.user.id;

    // Find the task in Schedule
    const scheduledTask = await Schedule.findById(eventId);
    if (!scheduledTask) {
      return res.status(404).json({ message: 'Scheduled task not found.' });
    }

    // Ensure task is not already assigned
    const existingTask = await Task.findOne({ assignedTo: volunteerId, name: scheduledTask.name });
    if (existingTask) {
      return res.status(400).json({ message: 'Task is already in My Tasks.' });
    }

    // Move the task to My Tasks
    const newTask = new Task({
      name: scheduledTask.name,
      description: scheduledTask.description,
      location: scheduledTask.location,
      dueDate: scheduledTask.date,
      assignedTo: volunteerId,
      status: 'picked',
      postedBy: scheduledTask.assignedTo,
    });

    await newTask.save();

    // Remove the task from Schedule
    await Schedule.findByIdAndDelete(eventId);

    res.status(200).json({ message: 'Task moved to My Tasks successfully.', task: newTask });
  } catch (err) {
    console.error('Error moving task:', err);
    res.status(500).json({ message: 'Failed to move task to My Tasks.' });
  }
});





router.post('/post-task', authMiddleware, async (req, res) => {
  try {
    const { name, description, location, dueDate } = req.body;
    const volunteerId = req.user.id; // Ensure the logged-in user is assigned

    if (!volunteerId) {
      return res.status(400).json({ message: 'User ID not found. Please log in again.' });
    }

    const task = new Task({
      name,
      description,
      location,
      dueDate,
      postedBy: volunteerId, // Ensure postedBy is set correctly
      status: 'pending',
    });

    await task.save();
    res.status(201).json({ message: 'Task posted successfully.', task });
  } catch (err) {
    console.error('Error posting task:', err);
    res.status(500).json({ message: 'Failed to post task.' });
  }
});



// Fetch only unassigned & unscheduled tasks for display
router.get('/all-tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: null, // Exclude picked tasks
      isScheduled: false, // Exclude scheduled tasks
    })
      .populate('postedBy', 'name email');

    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks.' });
  }
});



// Fetch tasks specific to the volunteer's location
router.get('/tasks-by-location', authMiddleware, async (req, res) => {
  try {
    const volunteer = await User.findById(req.user.id);
    if (!volunteer || !volunteer.location) {
      return res.status(400).json({ message: 'Location not set for volunteer.' });
    }
    const tasks = await Task.find({ location: volunteer.location, assignedTo: null });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching location-specific tasks:', err);
    res.status(500).json({ message: 'Failed to fetch location-specific tasks.' });
  }
});

// volunteer's location
router.put('/update-location', authMiddleware, async (req, res) => {
  const { location } = req.body;
  try {
    const volunteer = await User.findById(req.user.id);
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found.' });

    volunteer.location = location;
    await volunteer.save();
    res.status(200).json({ message: 'Location updated successfully.', volunteer });
  } catch (err) {
    console.error('Error updating location:', err);
    res.status(500).json({ message: 'Failed to update location.' });
  }
});

router.post('/pick-task', authMiddleware, async (req, res) => {
  const { taskId } = req.body;
  const userId = req.user.id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    if (task.assignedTo) {
      return res.status(400).json({ message: 'Task is already assigned to another volunteer.' });
    }

    // Assign task to volunteer
    task.assignedTo = userId;
    task.status = 'picked'; // Mark it as picked
    await task.save();

    res.status(200).json({ message: 'Task picked successfully.', task });
  } catch (err) {
    console.error('Error picking task:', err);
    res.status(500).json({ message: 'Failed to pick task.' });
  }
});





module.exports = router;
