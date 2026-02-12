import React from 'react';
import { Link } from 'react-router-dom';
import signupImage from '../images/signup.png'; 
import taskImage from '../images/task.png'; 
import volunteerImage from '../images/volunteer.png'; 

function Home() {
  return (
    <div>
      <section className="bg-gradient-to-r from-blue-50 to-green-50 py-16">
  <div className="container mx-auto text-center px-4 md:px-8">
    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
      Join Us in Making a Difference
    </h2>
    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
      Together, we can coordinate disaster relief efforts and provide support to those in need during natural disasters.
    </p>
    <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
      <Link
        to="/register"
        className="bg-blue-600 text-white px-8 py-4 text-lg rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
      >
        Join as a Volunteer
      </Link>
      <Link
        to="/donate"
        className="bg-green-600 text-white px-8 py-4 text-lg rounded-lg shadow-md hover:bg-green-700 transition duration-300"
      >
        Donate Now
      </Link>
    </div>
  </div>
</section>


<section className="py-16 bg-gray-50">
  <div className="container mx-auto px-4 md:px-8">
    <h3 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
      How to Join as a Volunteer
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
        <div className="mb-6">
          <img
            src={signupImage}
            alt="Sign Up"
            className="w-24 h-24 mx-auto"
          />
        </div>
        <h4 className="text-2xl font-semibold text-gray-700 mb-4">Step 1: Sign Up</h4>
        <p className="text-gray-600">
          Register for an account as a volunteer and fill in your profile with your skills and availability.
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
        <div className="mb-6">
          <img
            src={taskImage}
            alt="Apply for Tasks"
            className="w-24 h-24 mx-auto"
          />
        </div>
        <h4 className="text-2xl font-semibold text-gray-700 mb-4">Step 2: Apply for Tasks</h4>
        <p className="text-gray-600">
          Browse available tasks in your area and apply for the ones that match your skills.
        </p>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
        <div className="mb-6">
          <img
            src={volunteerImage}
            alt="Start Volunteering"
            className="w-24 h-24 mx-auto"
          />
        </div>
        <h4 className="text-2xl font-semibold text-gray-700 mb-4">Step 3: Start Volunteering</h4>
        <p className="text-gray-600">
          Once approved, start contributing to the relief efforts and make a real impact.
        </p>
      </div>
    </div>
  </div>
</section>

    </div>
  );
}

export default Home;
