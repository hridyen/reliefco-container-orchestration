import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyProfile() {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    role: '',
    location: '', // Added location field
  });

  const [locations, setLocations] = useState([]); // Dynamic locations
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    // Fetch the current user's profile data
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/volunteer/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(response.data);
      } catch (err) {
        setError('Failed to fetch profile data.');
      }
    };

    // Fetch locations dynamically
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/locations');
        setLocations(response.data);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setLocations(['Delhi', 'Mumbai', 'Chennai', 'Kolkata']); // Fallback static locations
      }
    };

    fetchProfile();
    fetchLocations();
  }, []);

  const handleInputChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/volunteer/profile', profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProfile(response.data);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setSuccess('');
    }
  };

  const handleChangePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      setPasswordSuccess('');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/volunteer/change-password',
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setPasswordSuccess('Password updated successfully!');
      setPasswordError('');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      setPasswordError('Failed to update password. Please try again.');
      setPasswordSuccess('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Profile Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                name="mobileNumber"
                value={profile.mobileNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
              <select
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                disabled={!isEditing}
              >
                <option value="">Select a location...</option>
                {locations.map((loc, index) => (
                  <option key={index} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
              <input
                type="text"
                name="role"
                value={profile.role}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                disabled
              />
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-300"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mt-8">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>

          {passwordError && <p className="text-red-500 mb-4">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-500 mb-4">{passwordSuccess}</p>}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
              />
            </div>

            <button
              onClick={handleChangePassword}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Change Password
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyProfile;
