import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageTasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newTask, setNewTask] = useState({ name: '', description: '', location: '', dueDate: '', assignedTo: '' });
  const [selectedLocation, setSelectedLocation] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch tasks based on location filter
  const fetchTasks = async () => {
    try {
      const endpoint = selectedLocation
        ? `http://localhost:5000/api/admin/tasks?location=${selectedLocation}`
        : 'http://localhost:5000/api/admin/tasks';

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(response.data);
      setError('');
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError('Failed to fetch tasks.');
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to fetch users.');
    }
  };

  // Fetch available locations
  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/locations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLocations(response.data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
      setLocations(['Delhi', 'Mumbai', 'Chennai', 'Kolkata']); // Fallback locations
    }
  };

  // Create a new task
  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/admin/tasks',
        newTask,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setNewTask({ name: '', description: '', location: '', dueDate: '', assignedTo: '' });
      setSuccess('Task added successfully.');
      fetchTasks();
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task.');
    }
  };

  // Assign a task to a user
  const assignTask = async (taskId, userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/tasks/assign/${taskId}`,
        { userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSuccess('Task reassigned successfully.');
      fetchTasks();
    } catch (err) {
      console.error('Failed to assign task:', err);
      setError('Failed to assign task.');
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess('Task deleted successfully.');
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
      setError('Failed to delete task.');
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    fetchLocations();
  }, [selectedLocation]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Tasks</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {/* Location Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Location</label>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">All Locations</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Task Form */}
      <form onSubmit={createTask} className="space-y-4 mb-6">
        <input
          type="text"
          placeholder="Task Name"
          value={newTask.name}
          onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <textarea
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          rows="3"
          required
        ></textarea>
        <select
          value={newTask.location}
          onChange={(e) => setNewTask({ ...newTask, location: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        >
          <option value="">Select Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
        <select
          value={newTask.assignedTo}
          onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="">Assign to...</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} - {user.email}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>

      {/* Task List */}
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li key={task._id} className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{task.name}</h3>
              <p className="text-gray-600">{task.description}</p>
              <p className="text-gray-400 text-sm">Location: {task.location}</p>
              <p className="text-gray-400 text-sm">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p className="text-gray-400 text-sm">
                Assigned to: {task.assignedTo ? users.find((user) => user._id === task.assignedTo)?.name : 'Unassigned'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                onChange={(e) => assignTask(task._id, e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">Reassign</option>
                {users.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                onClick={() => deleteTask(task._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageTasks;
