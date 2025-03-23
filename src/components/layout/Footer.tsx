
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-bw-dark text-white py-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-heading mb-4">BuildWise UK</h4>
            <p className="text-sm text-gray-300">
              Connecting construction businesses with top freelance professionals throughout the UK and Ireland.
            </p>
          </div>
          
          <div>
            <h5 className="text-lg font-heading mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white">How It Works</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-lg font-heading mb-4">Legal</h5>
            <ul className="space-y-2">
              <li><Link to="/legal/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/legal/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/legal/cookies" className="text-gray-300 hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-lg font-heading mb-4">Contact</h5>
            <address className="text-gray-300 not-italic">
              <p>Email: info@buildwiseuk.com</p>
              <p>Phone: +44 20 1234 5678</p>
            </address>
            <div className="flex space-x-4 mt-4">
              {/* Social media icons would go here */}
              <span className="text-gray-300 hover:text-white">FB</span>
              <span className="text-gray-300 hover:text-white">TW</span>
              <span className="text-gray-300 hover:text-white">LI</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} BuildWise UK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
