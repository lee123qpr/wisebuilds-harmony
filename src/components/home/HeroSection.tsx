
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import RoleWordRotator from './RoleWordRotator';

const HeroSection = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-logo-light-blue to-logo-light-green">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-bw-dark mb-4 leading-tight">
              Connecting Construction Businesses & Freelance <RoleWordRotator />
            </h1>
            <p className="text-lg md:text-xl text-bw-gray-medium mb-8">
              Buildwise UK connects you with verified construction professionals for all your project needs. Unleash the power of outsourcing tasks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth/signup/business">
                <Button className="w-full sm:w-auto bg-logo-dark-blue text-white hover:bg-logo-dark-blue/90">
                  Post a Project
                </Button>
              </Link>
              <Link to="/auth/signup/freelancer">
                <Button variant="outline" className="w-full sm:w-auto border-logo-dark-blue text-logo-dark-blue hover:bg-logo-light-blue/20">
                  Join as Freelancer
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="/placeholder.svg" 
              alt="Construction professionals" 
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
