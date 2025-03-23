
import React from 'react';
import { Flag } from 'lucide-react';

const OurMission = () => {
  return (
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Flag className="h-8 w-8 mr-3 text-primary" />
            <h2 className="text-3xl font-heading font-bold">Our Mission</h2>
          </div>
          <p className="text-xl max-w-3xl mx-auto">
            To revolutionize how construction businesses find talent and how professionals
            find quality projects, creating a more efficient and transparent industry.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-white to-bw-gray-light p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">For Businesses</h3>
            <p className="mb-4">
              We're committed to helping construction businesses of all sizes find the right professionals 
              quickly and efficiently, reducing hiring time and project delays.
            </p>
            <p>
              Our platform provides access to pre-vetted, skilled professionals ready to contribute 
              to your projects immediately.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-white to-bw-gray-light p-8 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">For Professionals</h3>
            <p className="mb-4">
              We empower construction professionals to find quality projects that match their skills, 
              experience, and preferences.
            </p>
            <p>
              Our platform provides the tools and resources needed to showcase your expertise, 
              build a strong reputation, and develop a sustainable freelance career.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurMission;
