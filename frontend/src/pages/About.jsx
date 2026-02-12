import React from 'react';

function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-4xl font-extrabold text-blue-600 text-center mb-8">About Us</h1>
        <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto mb-12">
          ReliefCo is dedicated to enhancing disaster relief efforts by connecting volunteers, donors, and organizations with those in need. Our platform is committed to building a resilient community capable of responding to crises swiftly and effectively.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Our Mission</h3>
            <p className="text-gray-600">
              To deliver immediate and coordinated support to disaster-affected areas by mobilizing community resources and providing transparent donation processes.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Our Vision</h3>
            <p className="text-gray-600">
              To build a connected and resilient society that can respond effectively to any crisis, ensuring community-driven relief efforts are accessible to all.
            </p>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">Core Values</h3>
            <p className="text-gray-600">
              Integrity, Transparency, Community, and Compassion are at the heart of everything we do at ReliefCo.
            </p>
          </div>
        </div>

        <div className="bg-blue-600 text-white py-12 px-6 rounded-lg shadow-lg text-center mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">Join Us in Making a Difference</h2>
          <p className="text-lg mb-6">
            ReliefCo invites you to become a part of a community committed to supporting those in need during times of crisis. Whether as a volunteer or a donor, your contribution makes a real impact.
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
          >
            Get Involved
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;
