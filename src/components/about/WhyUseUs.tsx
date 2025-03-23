
import React from 'react';
import { ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const WhyUseUs = () => {
  const benefits = [
    {
      title: 'Verified Professionals',
      description: 'Every freelancer on our platform undergoes a thorough verification process to ensure quality and reliability.'
    },
    {
      title: 'Project Matching',
      description: 'Our intelligent matching system connects businesses with the most suitable professionals for their specific needs.'
    },
    {
      title: 'Secure Payments',
      description: 'Our secure payment system protects both parties and ensures fair compensation for work delivered.'
    },
    {
      title: 'Dedicated Support',
      description: 'Our team of industry experts provides support throughout the entire process, from hiring to project completion.'
    },
    {
      title: 'Quality Guarantee',
      description: 'We stand behind the quality of work delivered through our platform with our satisfaction guarantee.'
    },
    {
      title: 'Time Efficiency',
      description: 'Find the right professional in days, not weeks, helping your projects stay on schedule.'
    }
  ];
  
  return (
    <div className="py-16 px-4 bg-bw-off-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <ThumbsUp className="h-8 w-8 mr-3 text-primary" />
            <h2 className="text-3xl font-heading font-bold">Why Use Us?</h2>
          </div>
          <p className="text-xl max-w-3xl mx-auto">
            BuildWise UK offers unique advantages for both construction businesses and professionals.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p>{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyUseUs;
