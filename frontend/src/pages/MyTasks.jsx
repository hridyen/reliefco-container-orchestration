import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyTasks() {
  const [pickedTasks, setPickedTasks] = useState([]); // Stores picked tasks
  const [localTasks, setLocalTasks] = useState([]); // Stores tasks in the volunteer's location
  const [currentLocation, setCurrentLocation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  useEffect(() => {
    fetchTasks();
    fetchTasksByLocation();
  }, [currentLocation]);

  // Fetch picked tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/volunteer/picked-tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setPickedTasks(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching picked tasks:', err);
      setError('Failed to fetch your picked tasks.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks available in the volunteer's location
  const fetchTasksByLocation = async () => {
    try {
      if (currentLocation) {
        const response = await axios.get(
          `http://localhost:5000/api/volunteer/tasks-by-location?location=${currentLocation}`,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setLocalTasks(response.data.filter((task) => !task.assignedTo));
      } else {
        setLocalTasks([]);
      }
    } catch (err) {
      console.error('Error fetching tasks by location:', err);
    }
  };

  // Mark a task as completed
  const handleMarkAsCompleted = async (taskId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/volunteer/tasks/done/${taskId}`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Refresh the picked tasks list after marking as completed
      fetchTasks();

      alert(response.data.message || 'Task marked as completed!');
    } catch (err) {
      console.error('Error marking task as completed:', err);
      alert(err.response?.data?.message || 'Failed to mark task as completed.');
    }
  };

  // Pick a new task and add it to MyTasks
  const handlePickTask = async (taskId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/volunteer/pick-task',
        { taskId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      // Add the picked task to MyTasks immediately
      const pickedTask = localTasks.find((task) => task._id === taskId);
      setPickedTasks((prev) => [...prev, { ...pickedTask, assignedTo: true }]);

      // Remove task from local tasks
      setLocalTasks((prev) => prev.filter((task) => task._id !== taskId));

      alert('Task picked successfully!');
    } catch (err) {
      console.error('Error picking task:', err);
      alert(err.response?.data?.message || 'Failed to pick task.');
    }
  };

  // Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentPickedTasks = pickedTasks.slice(indexOfFirstTask, indexOfLastTask);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4 text-gray-700">My Tasks</h2>
      {loading && <p className="text-blue-600">Loading...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Picked Tasks Section with Pagination */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4 text-green-700">My Picked Tasks</h3>
        {pickedTasks.length === 0 ? (
          <p className="text-gray-600">You have not picked any tasks yet.</p>
        ) : (
          <div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPickedTasks.map((task) => (
                <li
                  key={task._id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-md hover:shadow-lg transition"
                >
                  <h3 className="font-semibold text-lg text-green-700">{task.name}</h3>
                  <p className="text-gray-600">Location: {task.location || 'Not specified'}</p>
                  <p className="text-gray-400 text-sm">Due: {new Date(task.dueDate).toLocaleDateString()}</p>

                  {/* Mark as Completed Button */}
                  <button
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition mt-2"
                    onClick={() => handleMarkAsCompleted(task._id)}
                  >
                    Complete Task
                  </button>
                </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
              {Array.from({ length: Math.ceil(pickedTasks.length / tasksPerPage) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 mx-1 rounded-lg ${
                    currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
                  } hover:bg-blue-700 transition`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tasks in Your Location */}
      <h3 className="text-xl font-bold mb-4 text-blue-700 mt-8">Tasks in Your Location</h3>
      {localTasks.length === 0 ? (
        <p className="text-gray-600">No tasks available in your location.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {localTasks.map((task) => (
            <li
              key={task._id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 shadow-md hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg text-blue-700">{task.name}</h3>
              <p className="text-gray-600">Location: {task.location || 'Not specified'}</p>
              <p className="text-gray-400 text-sm">Due: {new Date(task.dueDate).toLocaleDateString()}</p>

              <button
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition mt-2"
                onClick={() => handlePickTask(task._id)}
              >
                Pick Task
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyTasks;
