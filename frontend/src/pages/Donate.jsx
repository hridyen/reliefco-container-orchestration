import React, { useState } from 'react';
import axios from 'axios';

function Donate() {
  const [donationType, setDonationType] = useState('money');
  const [formData, setFormData] = useState({
    amount: '',
    goods: '',
    services: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with API endpoint to handle donation submission
      await axios.post('/api/donations', { ...formData, donationType });
      setSuccessMessage('Thank you for your donation!');
      setErrorMessage('');
      setFormData({ amount: '', goods: '', services: '', message: '' });
    } catch (error) {
      setErrorMessage('Failed to process your donation. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-600">Make a Donation</h2>
        {successMessage && <div className="text-green-500 mb-4 text-center">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mb-4 text-center">{errorMessage}</div>}
  
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Donation Type</label>
            <select
              value={donationType}
              onChange={(e) => setDonationType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
            >
              <option value="money">Money</option>
              <option value="goods">Goods</option>
              <option value="services">Services</option>
            </select>
          </div>
  
          {/* Conditional fields based on the selected donation type */}
          {donationType === 'money' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Amount (INR)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                placeholder="Enter donation amount"
                required
              />
            </div>
          )}
  
          {donationType === 'goods' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Goods Description</label>
              <textarea
                name="goods"
                value={formData.goods}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                placeholder="Describe the goods you are donating"
                rows="3"
                required
              ></textarea>
            </div>
          )}
  
          {donationType === 'services' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Service Description</label>
              <textarea
                name="services"
                value={formData.services}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                placeholder="Describe the services you can offer"
                rows="3"
                required
              ></textarea>
            </div>
          )}
  
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Message (Optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              placeholder="Include a message with your donation"
              rows="3"
            ></textarea>
          </div>
  
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Donate
          </button>
        </form>
      </div>
    </div>
  );
  
}

export default Donate;
