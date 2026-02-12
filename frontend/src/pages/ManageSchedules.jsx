import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [newSchedule, setNewSchedule] = useState({ name: '', date: '', description: '', assignedTo: '' });
  const [volunteers, setVolunteers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/admin/schedules', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSchedules(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch schedules.');
      } finally {
        setLoading(false);
      }
    };

    const fetchVolunteers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/volunteers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setVolunteers(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch volunteers.');
      }
    };

    fetchSchedules();
    fetchVolunteers();
  }, []);

  const createSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/schedules',
        newSchedule,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSchedules((prev) => [...prev, response.data]);
      setNewSchedule({ name: '', date: '', description: '', assignedTo: '' });
      setError('');
    } catch (err) {
      setError('Failed to create schedule.');
    } finally {
      setLoading(false);
    }
  };

  const assignSchedule = async (scheduleId, volunteerId) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:5000/api/admin/schedules/assign/${scheduleId}`,
        { assignedTo: volunteerId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSchedules((prev) =>
        prev.map((schedule) =>
          schedule._id === scheduleId ? { ...schedule, assignedTo: response.data.assignedTo } : schedule
        )
      );
      setError('');
    } catch (err) {
      setError('Failed to assign schedule.');
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this schedule?');
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/admin/schedules/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSchedules((prev) => prev.filter((schedule) => schedule._id !== id));
    } catch (err) {
      setError('Failed to delete schedule.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Schedules</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Schedule Form */}
      <form onSubmit={createSchedule} className="space-y-4 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Schedule Name"
          value={newSchedule.name}
          onChange={(e) => setNewSchedule({ ...newSchedule, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="date"
          value={newSchedule.date}
          onChange={(e) => setNewSchedule({ ...newSchedule, date: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          placeholder="Description"
          value={newSchedule.description}
          onChange={(e) => setNewSchedule({ ...newSchedule, description: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          required
        ></textarea>
        <select
          value={newSchedule.assignedTo}
          onChange={(e) => setNewSchedule({ ...newSchedule, assignedTo: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Assign to Volunteer</option>
          {volunteers.map((volunteer) => (
            <option key={volunteer._id} value={volunteer._id}>
              {volunteer.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Schedule'}
        </button>
      </form>

      {/* Schedule List */}
      {loading ? (
        <p className="text-blue-600">Loading schedules...</p>
      ) : (
        <ul className="space-y-4">
          {schedules.map((schedule) => (
            <li key={schedule._id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm">
              <div>
                <h3 className="font-semibold">{schedule.name}</h3>
                <p className="text-gray-600">{schedule.description}</p>
                <p className="text-gray-400 text-sm">Date: {new Date(schedule.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  onChange={(e) => assignSchedule(schedule._id, e.target.value)}
                  value={schedule.assignedTo?._id || ''}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="">Assign to Volunteer</option>
                  {volunteers.map((volunteer) => (
                    <option key={volunteer._id} value={volunteer._id}>
                      {volunteer.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => deleteSchedule(schedule._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageSchedules;
