
import React from 'react';
import { Book } from 'lucide-react';

const OurStory = () => {
  const timelineEvents = [
    { year: '2018', title: 'Founded in Manchester', description: 'Started with a vision to transform construction hiring.' },
    { year: '2019', title: 'First 100 Projects', description: 'Celebrated our 100th successful project match.' },
    { year: '2020', title: 'Nationwide Expansion', description: 'Expanded our services across the entire UK.' },
    { year: '2022', title: 'Ireland Launch', description: 'Extended our platform to Ireland.' },
    { year: '2023', title: 'Digital Transformation', description: 'Launched our new platform with enhanced features.' }
  ];
  
  return (
    <div className="py-16 px-4 bg-bw-off-white">
      <div className="container mx-auto max-w-5xl">
        <div className="flex items-center justify-center mb-12">
          <Book className="h-8 w-8 mr-3 text-primary" />
          <h2 className="text-3xl font-heading font-bold text-center">Our Story</h2>
        </div>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-logo-light-blue"></div>
          
          {/* Timeline events */}
          {timelineEvents.map((event, index) => (
            <div key={index} className={`flex flex-col md:flex-row md:justify-between mb-12 relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
              <div className="md:w-5/12"></div>
              <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center">
                <div className="bg-logo-dark-blue text-white rounded-full h-10 w-10 flex items-center justify-center z-10 shadow-md">
                  {event.year.slice(2)}
                </div>
              </div>
              <div className="md:w-5/12 ml-12 md:ml-0 pl-4 md:pl-0">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-2">{event.year}: {event.title}</h3>
                  <p>{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-lg">
            From our humble beginnings to today, we've remained committed to our core mission:
            connecting great construction professionals with quality projects.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurStory;
