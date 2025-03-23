
import React from 'react';
import { CircleHelp } from 'lucide-react';

const HowItWorksHero = () => {
  return (
    <div className="bg-bw-dark text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center mb-4">
          <CircleHelp className="h-10 w-10 mr-3 text-logo-light-blue" />
          <h1 className="text-4xl md:text-5xl font-heading font-bold">How BuildWise Works</h1>
        </div>
        <p className="text-xl max-w-3xl mx-auto text-gray-300 mt-6">
          Discover how our platform connects construction professionals with quality projects 
          across the UK and Ireland, creating successful partnerships that deliver results.
        </p>
      </div>
    </div>
  );
};

export default HowItWorksHero;
