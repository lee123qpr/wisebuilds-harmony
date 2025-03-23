
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-6">How BuildWise UK Works</h2>
        <p className="text-center text-bw-gray-medium max-w-3xl mx-auto mb-12">
          Unleash the power of Outsourcing Tasks. Learn more about how freelance construction professionals can fill the skills gap to ensure your business performs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="shadow-md border-t-4 border-t-logo-dark-blue hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-logo-light-blue rounded-full flex items-center justify-center text-logo-dark-blue text-2xl font-bold">1</div>
              </div>
              <h3 className="font-heading text-xl font-semibold text-center mb-2">Post a Project or Task</h3>
              <p className="text-center text-bw-gray-medium">
                Sign up, create a profile for free and post a task including your exact requirements.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-logo-dark-green hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-logo-light-green rounded-full flex items-center justify-center text-logo-dark-green text-2xl font-bold">2</div>
              </div>
              <h3 className="font-heading text-xl font-semibold text-center mb-2">Freelance Matching</h3>
              <p className="text-center text-bw-gray-medium">
                We will notify our suitable freelancers who match your requirements, and they will contact you to discuss finer details and provide a proposal.
              </p>
            </CardContent>
          </Card>
          
          <Card className="shadow-md border-t-4 border-t-logo-dark-blue hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto bg-logo-light-blue rounded-full flex items-center justify-center text-logo-dark-blue text-2xl font-bold">3</div>
              </div>
              <h3 className="font-heading text-xl font-semibold text-center mb-2">Hire a Verified Freelancer</h3>
              <p className="text-center text-bw-gray-medium">
                Hire your preferred freelancer after reviewing their profile and leave feedback after the work is done.
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
