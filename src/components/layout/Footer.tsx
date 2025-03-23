
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, X, Linkedin, Instagram } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Footer: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <footer className="bg-bw-dark text-white py-6 sm:py-8">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <h4 className="text-lg sm:text-xl font-heading mb-3 sm:mb-4">BuildWise UK</h4>
            <p className="text-xs sm:text-sm text-gray-300 mb-4">
              Connecting construction businesses with top freelance professionals throughout the UK and Ireland.
            </p>
          </div>
          
          <div>
            <h5 className="text-base sm:text-lg font-heading mb-2 sm:mb-4">Quick Links</h5>
            <ul className="space-y-1 sm:space-y-2 text-sm">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/how-it-works" className="text-gray-300 hover:text-white">How It Works</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-base sm:text-lg font-heading mb-2 sm:mb-4">Help Centre</h5>
            <ul className="space-y-1 sm:space-y-2 text-sm">
              <li><Link to="/help/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
              <li><Link to="/help/articles" className="text-gray-300 hover:text-white">Articles</Link></li>
              <li><Link to="/help/guides" className="text-gray-300 hover:text-white">Guides</Link></li>
              <li><Link to="/help/announcements" className="text-gray-300 hover:text-white">Announcements</Link></li>
              <li><Link to="/help/resources" className="text-gray-300 hover:text-white">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-base sm:text-lg font-heading mb-2 sm:mb-4">Legal</h5>
            <ul className="space-y-1 sm:space-y-2 text-sm">
              <li><Link to="/legal/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/legal/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/cookie-policy" className="text-gray-300 hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="text-base sm:text-lg font-heading mb-2 sm:mb-4">Contact</h5>
            <address className="text-gray-300 not-italic text-sm">
              <p className="mb-1">Email: info@buildwiseuk.com</p>
              <p className="mb-1">Phone: +44 20 3897 2233</p>
              <p>71-75 Shelton Street, London WC2H 9JQ</p>
            </address>
            <div className="flex space-x-3 sm:space-x-4 mt-3 sm:mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={isMobile ? 16 : 20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <X size={isMobile ? 16 : 20} />
                <span className="sr-only">X (formerly Twitter)</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin size={isMobile ? 16 : 20} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={isMobile ? 16 : 20} />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-6 sm:mt-8 pt-4 border-t border-gray-700 text-center text-gray-400 text-xs sm:text-sm">
          <p>&copy; {new Date().getFullYear()} BuildWise UK. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
