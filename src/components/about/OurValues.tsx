
import React from 'react';
import { Heart } from 'lucide-react';

const OurValues = () => {
  const values = [
    {
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, from our platform performance to the quality of professionals we connect with businesses.'
    },
    {
      title: 'Integrity',
      description: 'We operate with complete transparency and honesty, building trust with every interaction on our platform.'
    },
    {
      title: 'Innovation',
      description: 'We continuously improve our platform and processes to better serve the evolving needs of the construction industry.'
    },
    {
      title: 'Community',
      description: 'We foster a supportive community of construction professionals and businesses, facilitating knowledge sharing and growth.'
    }
  ];
  
  return (
    <div className="py-16 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 mr-3 text-primary" />
            <h2 className="text-3xl font-heading font-bold">Our Values</h2>
          </div>
          <p className="text-xl max-w-3xl mx-auto">
            These core principles guide everything we do at BuildWise UK.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <div key={index} className="flex">
              <div className="mr-4 mt-1">
                <div className="h-10 w-10 rounded-full bg-logo-light-blue flex items-center justify-center">
                  <span className="font-bold text-logo-dark-blue">{index + 1}</span>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-lg">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-xl mb-6">Join the BuildWise UK community today!</p>
          <div className="flex justify-center gap-4">
            <a href="/signup" className="bg-primary text-white py-3 px-8 rounded-md font-semibold hover:bg-primary/90 transition-colors">
              Sign Up Now
            </a>
            <a href="/how-it-works" className="bg-white border border-primary text-primary py-3 px-8 rounded-md font-semibold hover:bg-gray-50 transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurValues;
