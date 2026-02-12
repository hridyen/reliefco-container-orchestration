import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/volunteer" className="bg-blue-600 text-white p-4 rounded shadow">
          Volunteer Dashboard
        </Link>
        <Link to="/admin" className="bg-green-600 text-white p-4 rounded shadow">
          Admin Dashboard
        </Link>
        <Link to="/donate" className="bg-yellow-600 text-white p-4 rounded shadow">
          Donate Now
        </Link>
        <Link to="/resourcerequests" className="bg-red-600 text-white p-4 rounded shadow">
          Resource Requests
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
