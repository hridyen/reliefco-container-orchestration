import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Updates() {
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUpdates = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/volunteer/updates', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setUpdates(response.data);
          setError(''); // Clear any existing errors
        } catch (err) {
          console.error('Error fetching updates:', err);
          setError('Failed to load updates.');
        }
      };
      

    fetchUpdates();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Updates & Announcements</h2>
      {error && <p className="text-red-500">{error}</p>}
      {updates.length === 0 ? (
        <p className="text-gray-600">No updates available.</p>
      ) : (
        <ul>
          {updates.map((update) => (
            <li key={update._id} className="mb-4">
              <p className="font-semibold text-green-700">{update.title}</p>
              <p className="text-gray-600">{update.description}</p>
              <p className="text-gray-400 text-sm">Posted: {new Date(update.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Updates;
