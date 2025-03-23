
import React from 'react';
import { Users } from 'lucide-react';

const WhoWeAre = () => {
  return (
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <div className="flex items-center mb-6">
              <Users className="h-8 w-8 mr-3 text-primary" />
              <h2 className="text-3xl font-heading font-bold">Who We Are</h2>
            </div>
            <p className="text-lg mb-4">
              BuildWise UK is a specialized platform connecting skilled construction professionals with businesses 
              throughout the United Kingdom and Ireland.
            </p>
            <p className="text-lg mb-4">
              Our team combines decades of construction industry experience with cutting-edge technology 
              to create meaningful connections between top talent and quality projects.
            </p>
            <p className="text-lg">
              We've helped over 1,500 construction businesses find the right professionals for their projects,
              and enabled more than 5,000 freelancers to build successful careers.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="aspect-video bg-gradient-to-br from-logo-light-blue to-logo-dark-blue rounded-lg shadow-xl flex items-center justify-center">
              <img 
                src="/partners/morgan-sindall.svg" 
                alt="Construction professionals at work" 
                className="w-3/4 opacity-80"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhoWeAre;
