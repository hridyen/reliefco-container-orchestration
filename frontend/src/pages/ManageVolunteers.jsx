import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ManageVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/volunteers', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setVolunteers(response.data);
      } catch (err) {
        setError('Failed to fetch volunteers.');
      }
    };

    fetchVolunteers();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Manage Volunteers</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {volunteers.length === 0 ? (
        <p className="text-gray-600">No volunteers found.</p>
      ) : (
        <ul className="space-y-4">
          {volunteers.map((volunteer) => (
            <li key={volunteer._id} className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{volunteer.name}</h3>
                <p className="text-gray-600">{volunteer.email}</p>
              </div>
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ManageVolunteers;
