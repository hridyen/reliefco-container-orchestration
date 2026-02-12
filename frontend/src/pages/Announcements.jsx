import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/announcements', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAnnouncements(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch announcements.');
    } finally {
      setLoading(false);
    }
  };

  const createAnnouncement = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await axios.post(
        'http://localhost:5000/api/admin/announcements',
        newAnnouncement,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setNewAnnouncement({ title: '', description: '' });
      setSuccessMessage('Announcement posted successfully!');
      setAnnouncements((prev) => [...prev, response.data]);
    } catch (err) {
      setError('Failed to create announcement.');
    }
  };

  const deleteAnnouncement = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this announcement?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/announcements/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAnnouncements((prev) => prev.filter((announcement) => announcement._id !== id));
      setSuccessMessage('Announcement deleted successfully!');
    } catch (err) {
      setError('Failed to delete announcement.');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Announcements</h2>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p className="text-blue-600">Loading announcements...</p>
      ) : (
        <>
          {/* Announcement Form */}
          <form onSubmit={createAnnouncement} className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Title"
              value={newAnnouncement.title}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Description"
              value={newAnnouncement.description}
              onChange={(e) =>
                setNewAnnouncement({ ...newAnnouncement, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Post Announcement
            </button>
          </form>

          {/* Announcement List */}
          <ul className="space-y-4">
            {announcements.map((announcement) => (
              <li key={announcement._id} className="border-b pb-4">
                <p className="font-semibold text-gray-800">{announcement.title}</p>
                <p className="text-gray-600">{announcement.description}</p>
                <p className="text-gray-400 text-sm">
                  Posted: {new Date(announcement.createdAt).toLocaleString()}
                </p>
                <button
                  onClick={() => deleteAnnouncement(announcement._id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 mt-2"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Announcements;
