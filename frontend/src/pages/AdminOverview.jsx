import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminOverview() {
  const [stats, setStats] = useState({
    totalVolunteers: 0,
    activeTasks: 0,
    upcomingSchedules: 0,
  });
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
        setError('Failed to load dashboard statistics.');
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/locations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLocations(response.data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setLocations(['Delhi', 'Mumbai', 'Chennai', 'Kolkata']); // Fallback locations
      }
    };

    fetchStats();
    fetchLocations();
  }, []);

  const handleLocationChange = async (e) => {
    const location = e.target.value;
    setSelectedLocation(location);

    try {
      const response = await axios.get(`http://localhost:5000/api/admin/stats?location=${location}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats for location:', err);
      setError('Failed to load statistics for the selected location.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Overview</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Location Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Location</label>
        <select
          value={selectedLocation}
          onChange={handleLocationChange}
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

      {/* Statistics Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Total Volunteers</h3>
          <p className="text-3xl">{stats.totalVolunteers}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Active Tasks</h3>
          <p className="text-3xl">{stats.activeTasks}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Upcoming Schedules</h3>
          <p className="text-3xl">{stats.upcomingSchedules}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;
