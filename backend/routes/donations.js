const express = require('express');
const Donation = require('../models/Donation');
const router = express.Router();

// Create a new donation
router.post('/', async (req, res) => {
  const { donorId, amount, type } = req.body;
  try {
    const donation = new Donation({ donor: donorId, amount, type });
    await donation.save();
    res.status(201).json({ message: 'Donation created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all donations
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find().populate('donor');
    res.json(donations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
