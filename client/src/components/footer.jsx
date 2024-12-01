import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-sky-100 py-6 px-5 mt-10 text-sky-900">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between gap-6">
        
        {/* Left Section */}
        <div className="transition-transform transform hover:scale-105 duration-300">
          <h3 className="text-2xl font-semibold mb-3 hover:text-sky-600 transition-colors duration-300">Dream House</h3>
          <p className="text-sm">
            Your trusted partner in buying, selling, and renting homes.
          </p>
        </div>

        {/* Center Links Section */}
        <div className="flex flex-col items-center md:items-start transition-transform transform hover:scale-105 duration-300">
          <h4 className="text-xl font-semibold mb-2 hover:text-sky-600 transition-colors duration-300">Quick Links</h4>
          <nav className="flex flex-col gap-2">
            <Link 
              to="/" 
              className="hover:text-sky-600 transition-colors duration-300 transform hover:scale-105"
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className="hover:text-sky-600 transition-colors duration-300 transform hover:scale-105"
            >
              About Us
            </Link>
            <Link 
              to="/services" 
              className="hover:text-sky-600 transition-colors duration-300 transform hover:scale-105"
            >
              Services
            </Link>
            <Link 
              to="/contact" 
              className="hover:text-sky-600 transition-colors duration-300 transform hover:scale-105"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Right Social Section */}
        <div className="text-center md:text-left transition-transform transform hover:scale-105 duration-300">
          <h4 className="text-xl font-semibold mb-2 hover:text-sky-600 transition-colors duration-300">Connect with Us</h4>
          <div className="flex justify-center md:justify-start gap-6 text-sky-600">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noreferrer"
              className="transition-transform transform hover:scale-110 duration-300"
            >
              <FaFacebook className="text-3xl hover:text-sky-800 transition-colors duration-300" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noreferrer"
              className="transition-transform transform hover:scale-110 duration-300"
            >
              <FaTwitter className="text-3xl hover:text-sky-800 transition-colors duration-300" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noreferrer"
              className="transition-transform transform hover:scale-110 duration-300"
            >
              <FaInstagram className="text-3xl hover:text-sky-800 transition-colors duration-300" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noreferrer"
              className="transition-transform transform hover:scale-110 duration-300"
            >
              <FaLinkedin className="text-3xl hover:text-sky-800 transition-colors duration-300" />
            </a>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div className="text-center text-xs text-sky-800 mt-6 border-t pt-4">
        &copy; {new Date().getFullYear()} Dream House. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
