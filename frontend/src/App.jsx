import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Header from './components/Header';
import Footer from './components/Footer';
import Donate from './pages/Donate';
import ResourceRequests from './pages/ResourceRequests';
import About from './pages/About';
import Contact from './pages/Contact';
import MyProfile from './pages/MyProfile'; 
import MyTasks from './pages/MyTasks';
import MySchedule from './pages/MySchedule';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Updates from './pages/Updates';
import PostTask from './pages/PostTask';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/volunteer/profile" element={<MyProfile />} /> 
          <Route path="/volunteer/tasks" element={<MyTasks />} /> 
          <Route path="/volunteer/schedule" element={<MySchedule />} /> 
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/resourcerequests" element={<ResourceRequests />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/volunteer/post-task" element={<PostTask />} />


        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
