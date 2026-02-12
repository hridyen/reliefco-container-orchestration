import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MySchedule() {
  const [schedule, setSchedule] = useState([]);
  const [filteredSchedule, setFilteredSchedule] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');

  useEffect(() => {
    fetchSchedule();
    fetchLocations();
  }, []);

  const fetchSchedule = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/volunteer/schedule', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSchedule(response.data);
      setFilteredSchedule(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching schedule:', err);
      setError('Failed to fetch schedule. Please try again.');
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/locations', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLocations(response.data);
    } catch (err) {
      console.error('Error fetching locations:', err);
      setLocations(['Delhi', 'Mumbai', 'Chennai', 'Kolkata']);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const filtered = schedule.filter((event) =>
      event.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredSchedule(filtered);
  };

  const handleLocationFilter = (location) => {
    setSelectedLocation(location);
    const filtered = schedule.filter((event) => event.location === location);
    setFilteredSchedule(filtered);
  };

  const handleSort = () => {
    const sorted = [...filteredSchedule].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setFilteredSchedule(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSchedule.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleViewDetails = (event) => setSelectedEvent(event);

  const handleDelete = async (eventId) => {
    try {
      await axios.delete(`http://localhost:5000/api/volunteer/schedule/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      
      setSchedule((prev) => prev.filter((event) => event._id !== eventId));
      setFilteredSchedule((prev) => prev.filter((event) => event._id !== eventId));
      
      alert('Task deleted successfully!');
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete the event. Please try again.');
    }
  };

  const handleMoveToTasks = async (eventId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/volunteer/move-to-my-tasks',
        { eventId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
  
      setSchedule((prev) => prev.filter((event) => event._id !== eventId));
      setFilteredSchedule((prev) => prev.filter((event) => event._id !== eventId));
  
      alert(response.data.message || 'Task moved to My Tasks!');
    } catch (err) {
      console.error('Error moving task:', err);
      setError(err.response?.data?.message || 'Failed to move task.');
    }
  };
  
  

  const handleConvertToMyTasks = async (eventId) => {
    try {
      await axios.post(
        'http://localhost:5000/api/volunteer/convert-to-task',
        { eventId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      setSchedule((prev) => prev.filter((event) => event._id !== eventId));
      setFilteredSchedule((prev) => prev.filter((event) => event._id !== eventId));

      alert('Task converted to My Tasks successfully!');
    } catch (err) {
      console.error('Error converting task:', err);
      setError('Failed to convert task. Please try again.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">My Schedule</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={handleSearch}
          className="border rounded px-4 py-2 w-1/2"
        />
        <select
          value={selectedLocation}
          onChange={(e) => handleLocationFilter(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="">Filter by Location</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>
              {location}
            </option>
          ))}
        </select>
        <button
          onClick={handleSort}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Sort by Date ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
        </button>
      </div>

      {filteredSchedule.length === 0 ? (
        <p className="text-gray-600">No scheduled tasks or events at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((event) => (
            <div key={event._id} className="bg-white border border-gray-300 p-4 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-700">{event.name}</h3>
              <p className="text-gray-600">📅 Date: {new Date(event.date).toLocaleDateString()}</p>
              <p className="text-gray-600">⏰ Time: {event.time ? event.time : 'N/A'}</p>
              <p className="text-gray-600">📍 Location: {event.location || 'Not specified'}</p>
              <p className="text-gray-600">{event.description}</p>
              
              <div className="mt-4 flex flex-col space-y-2">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => handleViewDetails(event)}
                >
                  View Details
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete Task
                </button>
                <button
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                  onClick={() => handleMoveToTasks(event._id)}
                >
                  Move to My Tasks
                </button>

              </div>
            </div>
          ))}
        </div>

      )}

      <div className="mt-6 flex justify-center space-x-2">
        {[...Array(Math.ceil(filteredSchedule.length / itemsPerPage)).keys()].map((num) => (
          <button
            key={num}
            onClick={() => handlePageChange(num + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === num + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            {num + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default MySchedule;
