const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true }, // Used for filtering tasks based on volunteer location
  dueDate: { type: Date },

  status: {
    type: String,
    enum: ['active', 'completed', 'done', 'pending', 'picked'], // Task lifecycle
    default: 'active',
  },

  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Volunteer who picks the task
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Tracks who completes it
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Who created the task

  isScheduled: { type: Boolean, default: false }, // Ensures a task is scheduled only once
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', TaskSchema);
