const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); 
const User = require('./models/User'); 
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');
const volunteerRoutes = require('./routes/volunteer');
const adminRoutes = require('./routes/admin');
const locationsRoutes = require('./routes/locations');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => {
    console.log('MongoDB connected');
    initializeAdminAccount(); // Create the admin account if it doesn't exist
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Function to initialize the admin account
async function initializeAdminAccount() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminMobileNumber = process.env.ADMIN_MOBILE || '+911234567890'; // Default admin mobile number
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin', 12);
      const adminUser = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        mobileNumber: adminMobileNumber,
        role: 'admin',
      });
      await adminUser.save();
      console.log('Admin account created successfully');
    } else {
      console.log('Admin account already exists');
    }
  } catch (error) {
    console.error('Error initializing admin account:', error);
  }
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/locations', locationsRoutes);

// Socket.IO for real-time events
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
