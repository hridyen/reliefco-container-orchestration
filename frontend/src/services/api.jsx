import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const login = (email, password) =>
  axios.post(`${API_URL}/api/auth/login`, { email, password });

export const register = (userData) =>
  axios.post(`${API_URL}/api/auth/register`, userData);

export const getDonations = () =>
  axios.get(`${API_URL}/api/donations`);

export const createDonation = (donationData) =>
  axios.post(`${API_URL}/api/donations`, donationData);

export const fetchAnalytics = () =>
  axios.get(`${API_URL}/api/admin/analytics`);
