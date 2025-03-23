
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Testimonials = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">What Our Users Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-md">
            <CardContent className="p-6">
              <p className="italic text-bw-gray-medium mb-4">
                "BuildWise UK has transformed how we find qualified professionals for our projects. The platform is intuitive and the verification process ensures we only work with top talent."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-logo-light-blue rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-bw-gray-medium">Project Manager, London Construction Ltd</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardContent className="p-6">
              <p className="italic text-bw-gray-medium mb-4">
                "As a freelance quantity surveyor, BuildWise UK has become my go-to platform for finding new clients. The credit system is fair and I've secured several long-term contracts through leads purchased here."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-logo-light-green rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">James Miller</h4>
                  <p className="text-sm text-bw-gray-medium">Quantity Surveyor, Manchester</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
