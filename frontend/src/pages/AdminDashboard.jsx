import React from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import AdminOverview from './AdminOverview';
import ManageVolunteers from './ManageVolunteers';
import ManageTasks from './ManageTasks';
import ManageSchedules from './ManageSchedules';
import Announcements from './Announcements';

function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">
          <Link to="/admin">Admin Dashboard</Link>
        </div>
        <nav className="flex-grow px-4">
          <Link to="/admin" className="block py-2 px-4 rounded hover:bg-gray-700">
            Overview
          </Link>
          <Link to="/admin/volunteers" className="block py-2 px-4 rounded hover:bg-gray-700">
            Manage Volunteers
          </Link>
          <Link to="/admin/tasks" className="block py-2 px-4 rounded hover:bg-gray-700">
            Manage Tasks
          </Link>
          <Link to="/admin/schedules" className="block py-2 px-4 rounded hover:bg-gray-700">
            Manage Schedules
          </Link>
          <Link to="/admin/announcements" className="block py-2 px-4 rounded hover:bg-gray-700">
            Announcements
          </Link>
        </nav>
        <div className="p-4">
          <button className="w-full bg-red-600 py-2 rounded hover:bg-red-700">Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-6">
        <Routes>
          <Route path="/" element={<AdminOverview />} />
          <Route path="/volunteers" element={<ManageVolunteers />} />
          <Route path="/tasks" element={<ManageTasks />} />
          <Route path="/schedules" element={<ManageSchedules />} />
          <Route path="/announcements" element={<Announcements />} />
        </Routes>
      </main>
    </div>
  );
}

export default AdminDashboard;
