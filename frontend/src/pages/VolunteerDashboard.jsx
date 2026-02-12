import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiClipboard, FiCalendar, FiBell, FiDollarSign, FiUser, FiLogOut, FiPlus } from 'react-icons/fi';
import axios from 'axios';

function VolunteerDashboard() {
  const [overviewData, setOverviewData] = useState({ tasksCompleted: 0, upcomingEvents: 0, totalHours: 0 });
  const [tasks, setTasks] = useState([]);
  const [locationTasks, setLocationTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [currentLocation, setCurrentLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewRes, tasksRes, announcementsRes, locationRes] = await Promise.all([
        axios.get('http://localhost:5000/api/volunteer/overview', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('http://localhost:5000/api/volunteer/all-tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('http://localhost:5000/api/volunteer/announcements', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        axios.get('http://localhost:5000/api/volunteer/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      setOverviewData(overviewRes.data);
      setTasks(tasksRes.data);
      setAnnouncements(announcementsRes.data);
      setCurrentLocation(locationRes.data.location);
      filterLocationTasks(tasksRes.data, locationRes.data.location);
      setError('');
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterLocationTasks = (allTasks, location) => {
    const filtered = allTasks.filter((task) => task.location === location);
    setLocationTasks(filtered);
  };

  const handlePickTask = async (taskId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/volunteer/pick-task`,
        { taskId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      // Remove task from UI
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setLocationTasks((prevLocationTasks) => prevLocationTasks.filter((task) => task._id !== taskId));
  
      alert('Task picked successfully!');
    } catch (err) {
      console.error('Error picking task:', err);
      alert('Failed to pick task. Please try again.');
    }
  };
  
  const handleScheduleTask = async (taskId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/volunteer/schedule`,
        { taskId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
  
      // Remove task from UI
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      setLocationTasks((prevLocationTasks) => prevLocationTasks.filter((task) => task._id !== taskId));
  
      alert('Task scheduled successfully!');
    } catch (err) {
      console.error('Error scheduling task:', err);
      alert('Failed to schedule task. Please try again.');
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">
          <Link to="/">Disaster Relief</Link>
        </div>
        <nav className="flex-grow px-4">
          <Link to="/volunteer" className="flex items-center py-2 px-4 rounded hover:bg-blue-600">
            <FiHome className="mr-2" /> Overview
          </Link>
          <Link to="/volunteer/tasks" className="flex items-center py-2 px-4 rounded hover:bg-blue-600">
            <FiClipboard className="mr-2" /> My Tasks
          </Link>
          <Link to="/volunteer/schedule" className="flex items-center py-2 px-4 rounded hover:bg-blue-600">
            <FiCalendar className="mr-2" /> My Schedule
          </Link>
          <Link to="/donate" className="flex items-center py-2 px-4 rounded hover:bg-blue-600">
            <FiDollarSign className="mr-2" /> Donate
          </Link>
          <Link to="/updates" className="flex items-center py-2 px-4 rounded hover:bg-blue-600">
            <FiBell className="mr-2" /> Updates & Announcements
          </Link>
          <Link to="/volunteer/post-task" className="flex items-center py-2 px-4 rounded hover:bg-blue-600">
            <FiPlus className="mr-2" /> Post a Task
          </Link>
          <Link to="/volunteer/profile" className="flex items-center py-2 px-4 rounded hover:bg-blue-600">
            <FiUser className="mr-2" /> My Profile
          </Link>
        </nav>
        <div className="p-4">
          <button className="w-full bg-red-600 py-2 rounded flex items-center justify-center hover:bg-red-700">
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => navigate('/volunteer/post-task')}
          >
            Post a Task
          </button>
        </div>

        {loading ? (
          <p className="text-blue-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Tasks Completed</h2>
                <p className="text-3xl text-blue-600 font-extrabold">{overviewData.tasksCompleted || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Upcoming Events</h2>
                <p className="text-3xl text-green-600 font-extrabold">{overviewData.upcomingEvents || 0}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Total Hours Volunteered</h2>
                <p className="text-3xl text-orange-600 font-extrabold">{overviewData.totalHours || 0} hrs</p>
              </div>
            </div>

            {/* Tasks Section */}
            <div className="mt-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-700">Tasks in Your Location</h2>
              <div className="bg-gray-50 rounded-lg shadow p-6">
                {locationTasks.length === 0 ? (
                  <p className="text-gray-600">No tasks available in your location.</p>
                ) : (
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {locationTasks.map((task) => (
                      <li
                        key={task._id}
                        className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition p-4 flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="text-xl font-semibold text-blue-600 mb-2">{task.name}</h3>
                          <p className="text-gray-600">
                            <span className="font-semibold">Location:</span> {task.location}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-semibold">Due:</span> {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="mt-4 flex space-x-2">
                          <button
                            onClick={() => handlePickTask(task._id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                          >
                            Pick Task
                          </button>
                          <button
                            onClick={() => handleScheduleTask(task._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                          >
                            Schedule Task
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-700">All Available Tasks</h2>
              <div className="bg-gray-50 rounded-lg shadow p-6">
                {tasks.length === 0 ? (
                  <p className="text-gray-600">No tasks available.</p>
                ) : (
                  <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
  <li key={task._id} className="bg-white border border-gray-200 rounded-lg shadow-md p-4 flex flex-col">
    <div>
      <h3 className="text-xl font-semibold text-blue-600 mb-2">{task.name}</h3>
      <p className="text-gray-600">
        <span className="font-semibold">Location:</span> {task.location || 'Not specified'}
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">Due:</span> {new Date(task.dueDate).toLocaleDateString()}
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">Posted By:</span> {task.postedBy?.name || 'Unknown'}
      </p>
    </div>

    {/* Pick Task & Schedule Task Buttons */}
    <div className="mt-4 flex justify-between">
      <button
        onClick={() => handlePickTask(task._id)}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Pick Task
      </button>
      <button
        onClick={() => handleScheduleTask(task._id)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Schedule Task
      </button>
    </div>
  </li>
))}

                  </ul>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default VolunteerDashboard;
