import React, { useState } from 'react';
import axios from 'axios';

function VolunteerForm() {
  const [formData, setFormData] = useState({ skill: '', availability: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/volunteers/signup', formData);
      console.log('Signup successful', response.data);
    } catch (error) {
      console.error('Error signing up', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto bg-white shadow-md rounded">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Skillset</label>
        <input
          type="text"
          value={formData.skill}
          onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
          className="mt-1 p-2 block w-full border rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Availability</label>
        <input
          type="text"
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          className="mt-1 p-2 block w-full border rounded"
          required
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Sign Up
      </button>
    </form>
  );
}

export default VolunteerForm;
