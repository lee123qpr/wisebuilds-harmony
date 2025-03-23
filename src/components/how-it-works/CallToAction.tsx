
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserHardHat, Building2 } from 'lucide-react';

const CallToAction = () => {
  return (
    <div className="py-16 px-4 bg-gradient-to-r from-logo-dark-blue to-logo-dark-green text-white">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl max-w-3xl mx-auto">
            Join thousands of construction professionals and businesses already using BuildWise UK 
            to connect, collaborate, and complete quality projects.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center hover:bg-white/15 transition-colors">
            <UserHardHat className="h-16 w-16 mx-auto mb-4 text-logo-light-blue" />
            <h3 className="text-2xl font-bold mb-4">Construction Professionals</h3>
            <p className="mb-6">
              Create your professional profile and start discovering quality projects matched to your skills and preferences.
            </p>
            <Link to="/auth/signup/freelancer">
              <Button className="bg-logo-light-blue text-logo-dark-blue hover:bg-logo-light-blue/80 w-full">
                Create Professional Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center hover:bg-white/15 transition-colors">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-logo-light-green" />
            <h3 className="text-2xl font-bold mb-4">Construction Businesses</h3>
            <p className="mb-6">
              Create your business profile and post your first project to connect with verified construction professionals.
            </p>
            <Link to="/auth/signup/business">
              <Button className="bg-logo-light-green text-logo-dark-green hover:bg-logo-light-green/80 w-full">
                Create Business Profile
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
