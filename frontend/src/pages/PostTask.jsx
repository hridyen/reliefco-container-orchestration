import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostTask() {
  const [task, setTask] = useState({ name: '', description: '', location: '', dueDate: '' });
  const [locations, setLocations] = useState([]); // Dynamic locations
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch dynamic locations from the backend
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/locations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLocations(response.data);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setLocations(['Delhi', 'Mumbai', 'Chennai', 'Kolkata']); // Fallback static locations
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post(
        'http://localhost:5000/api/volunteer/post-task',
        task,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess('Task posted successfully.');
      setTask({ name: '', description: '', location: '', dueDate: '' });
    } catch (err) {
      console.error('Error posting task:', err);
      setError('Failed to post task. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Post a Task</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Task Name"
          value={task.name}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={task.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          required
        ></textarea>
        <select
          name="location"
          value={task.location}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="dueDate"
          value={task.dueDate}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Post Task
          </button>
          <button
            type="button"
            onClick={() => navigate('/volunteer')}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostTask;
