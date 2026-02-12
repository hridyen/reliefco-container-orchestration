const mongoose = require('mongoose');
const DonationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  type: { type: String, enum: ['goods', 'money', 'services'] },
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Donation', DonationSchema);
