
import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ContactInfo = () => {
  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <h2 className="text-2xl font-heading font-bold mb-6 text-logo-dark-blue">Get In Touch</h2>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4 bg-logo-light-blue/20 p-3 rounded-full">
              <Phone className="h-6 w-6 text-logo-dark-blue" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Phone</h3>
              <p className="text-bw-gray-medium">
                <a href="tel:02038972233" className="hover:text-logo-dark-blue transition-colors">
                  020 3897 2233
                </a>
              </p>
              <p className="text-sm text-bw-gray-medium mt-1">Monday to Friday, 9am - 5pm</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4 bg-logo-light-green/20 p-3 rounded-full">
              <Mail className="h-6 w-6 text-logo-dark-green" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Email</h3>
              <p className="text-bw-gray-medium">
                <a href="mailto:info@buildwiseuk.com" className="hover:text-logo-dark-green transition-colors">
                  info@buildwiseuk.com
                </a>
              </p>
              <p className="text-sm text-bw-gray-medium mt-1">We aim to respond within 24 hours</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-4 bg-logo-light-blue/20 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-logo-dark-blue" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Office Location</h3>
              <p className="text-bw-gray-medium">
                71-75 Shelton Street<br />
                Covent Garden<br />
                London<br />
                WC2H 9JQ
              </p>
              <p className="text-sm text-bw-gray-medium mt-1">By appointment only</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="font-bold text-lg mb-3">Office Hours</h3>
          <ul className="space-y-1 text-bw-gray-medium">
            <li className="flex justify-between">
              <span>Monday - Friday</span>
              <span>9:00 AM - 5:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Saturday</span>
              <span>Closed</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday</span>
              <span>Closed</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
