import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ResourceRequests() {
  const [formData, setFormData] = useState({
    resourceType: '',
    quantity: '',
    location: '',
    description: '',
  });
  const [requests, setRequests] = useState([]); // Initial state as an empty array
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch existing resource requests from the API
    const fetchRequests = async () => {
      try {
        const response = await axios.get('/api/resources');
        // Assuming the response data contains an array of requests, set it directly.
        // If the data is wrapped, adjust accordingly (e.g., response.data.requests)
        setRequests(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Failed to fetch resource requests', error);
      }
    };

    fetchRequests();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with API endpoint to handle resource request submission
      await axios.post('/api/resources', formData);
      setSuccessMessage('Resource request submitted successfully!');
      setErrorMessage('');
      setFormData({ resourceType: '', quantity: '', location: '', description: '' });
      // Refresh the list of requests after submitting
      const response = await axios.get('/api/resources');
      setRequests(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setErrorMessage('Failed to submit the resource request. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md max-w-lg w-full mt-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Submit a Resource Request</h2>
        {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Resource Type</label>
            <input
              type="text"
              name="resourceType"
              value={formData.resourceType}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border rounded"
              placeholder="e.g., Medical Supplies, Food, Water"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border rounded"
              placeholder="Enter quantity needed"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border rounded"
              placeholder="Enter the affected area or relief center"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border rounded"
              placeholder="Provide details about the resource needed"
              rows="3"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit Request
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow-md max-w-4xl w-full mt-8">
        <h2 className="text-2xl font-bold mb-4">Current Resource Requests</h2>
        {requests.length === 0 ? (
          <p className="text-gray-500">No resource requests found.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((request) => (
              <li key={request.id} className="bg-gray-50 p-4 rounded shadow">
                <h3 className="text-xl font-semibold">{request.resourceType}</h3>
                <p className="text-gray-700">Quantity: {request.quantity}</p>
                <p className="text-gray-700">Location: {request.location}</p>
                <p className="text-gray-600">{request.description}</p>
                <p className="text-gray-400 text-sm">Requested: {new Date(request.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default ResourceRequests;
