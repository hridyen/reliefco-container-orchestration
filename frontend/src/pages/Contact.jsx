import React from 'react';

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-16">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-4xl font-extrabold text-green-600 text-center mb-8">Contact Us</h1>
        <p className="text-lg text-gray-700 text-center max-w-2xl mx-auto mb-12">
          Have a question, want to volunteer, or need assistance? Feel free to reach out to us. Our team is here to help you!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Send Us a Message</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  placeholder="Your email"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                  placeholder="Your message"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-600 text-white p-8 rounded-lg shadow-lg flex flex-col justify-center">
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.86 19.86 0 01-8.63-3.13 19.42 19.42 0 01-6-6 19.86 19.86 0 01-3.12-8.63A2 2 0 014.08 2h3a2 2 0 012 1.72 12.07 12.07 0 00.57 2.63 2 2 0 01-.45 2.11L8.1 9.63a16 16 0 006 6l1.17-1.17a2 2 0 012.11-.45 12.07 12.07 0 002.63.57 2 2 0 011.72 2z"/>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold">Phone</h3>
                  <p className="text-gray-200">+1 (123) 456-7890</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm2.6 1H9.4A6.4 6.4 0 003 19.4V21a1 1 0 001 1h16a1 1 0 001-1v-1.6a6.4 6.4 0 00-6.4-6.4z"/>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold">Email</h3>
                  <p className="text-gray-200">contact@reliefco.org</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <svg className="w-6 h-6 text-white" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M21 10V7a2 2 0 00-2-2h-3V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v1H5a2 2 0 00-2 2v3a10 10 0 1020 0zm-9 8a8 8 0 01-8-8V7h3v3a2 2 0 002 2h6a2 2 0 002-2V7h3v3a8 8 0 01-8 8z"/>
                </svg>
                <div>
                  <h3 className="text-lg font-semibold">Address</h3>
                  <p className="text-gray-200">123 Relief St, Compassion City, CA 90210</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
