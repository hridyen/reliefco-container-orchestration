const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['volunteer', 'donor', 'admin'], default: 'volunteer' },
  mobileNumber: { type: String, required: true },
  location: { type: String, default: 'Unknown' }, // Add dynamic location field
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },
  createdAt: { type: Date, default: Date.now }, // Track account creation time
});

module.exports = mongoose.model('User', UserSchema);
