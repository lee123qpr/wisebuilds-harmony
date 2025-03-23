
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">How BuildWise UK Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-md border-t-4 border-t-logo-dark-blue">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-logo-light-blue rounded-full flex items-center justify-center text-logo-dark-blue text-2xl font-bold">1</div>
              </div>
              <h3 className="font-heading text-xl font-semibold text-center mb-2">Post Your Project</h3>
              <p className="text-center text-bw-gray-medium">
                Construction businesses describe their project needs and requirements in detail.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-logo-dark-green">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-logo-light-green rounded-full flex items-center justify-center text-logo-dark-green text-2xl font-bold">2</div>
              </div>
              <h3 className="font-heading text-xl font-semibold text-center mb-2">Browse & Purchase Leads</h3>
              <p className="text-center text-bw-gray-medium">
                Freelancers find relevant projects and purchase leads using credits to access contact details.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-logo-dark-blue">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-logo-light-blue rounded-full flex items-center justify-center text-logo-dark-blue text-2xl font-bold">3</div>
              </div>
              <h3 className="font-heading text-xl font-semibold text-center mb-2">Connect & Collaborate</h3>
              <p className="text-center text-bw-gray-medium">
                Connect directly with businesses through our secure messaging system and begin your collaboration.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/how-it-works">
            <Button variant="outline" className="border-logo-dark-blue text-logo-dark-blue hover:bg-logo-light-blue/20">
              Learn More About How It Works
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
