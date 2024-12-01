import React, { useState } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form Submitted:', formData);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Heading Section */}
      <h1 className="text-4xl font-bold text-sky-800 text-center mb-8">
        Contact Us
      </h1>

      {/* Contact Form Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 shadow-xl rounded-xl">
          <h2 className="text-3xl font-semibold text-sky-800 mb-4">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-xl font-medium text-sky-700">Your Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-xl font-medium text-sky-700">Your Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-xl font-medium text-sky-700">Your Message</label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 transition-all duration-300"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-3xl text-sky-600" />
            <div>
              <h3 className="text-xl font-semibold text-sky-800">Our Office</h3>
              <p className="text-lg text-gray-700">
                123 Real Estate St, City, Country, 12345
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaPhoneAlt className="text-3xl text-sky-600" />
            <div>
              <h3 className="text-xl font-semibold text-sky-800">Phone Number</h3>
              <p className="text-lg text-gray-700">
                +1 234 567 890
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-3xl text-sky-600" />
            <div>
              <h3 className="text-xl font-semibold text-sky-800">Email Address</h3>
              <p className="text-lg text-gray-700">
                info@realestate.com
              </p>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="text-center md:text-left mt-8">
            <h3 className="text-xl font-semibold text-sky-800 mb-4">Connect With Us</h3>
            <div className="flex justify-center md:justify-start gap-6 text-sky-600">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition-all duration-300"
              >
                <FaFacebook className="text-2xl" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition-all duration-300"
              >
                <FaTwitter className="text-2xl" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition-all duration-300"
              >
                <FaInstagram className="text-2xl" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:scale-110 transition-all duration-300"
              >
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-sky-800 text-center mb-4">Find Us On The Map</h2>
        <div className="w-full h-96 bg-gray-300 rounded-lg">
          {/* You can embed a Google Map iframe here */}
          <iframe
            title="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3231.0260990229186!2d-122.41941548455593!3d37.774929679758246!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809f7f28b63b%3A0x92b1d74d8be982d7!2sGolden%20Gate%20Bridge!5e0!3m2!1sen!2sus!4v1633374801865!5m2!1sen!2sus"
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen=""
            aria-hidden="false"
            tabIndex="0"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
