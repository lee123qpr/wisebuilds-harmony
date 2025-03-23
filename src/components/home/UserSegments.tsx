
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const UserSegments = () => {
  return (
    <section className="py-16 bg-bw-off-white">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-white rounded-lg shadow-md p-8">
            <h3 className="font-heading text-2xl font-semibold mb-4 text-logo-dark-blue">For Construction Businesses</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-logo-dark-blue mr-2">✓</span>
                <span>Access a pool of qualified construction professionals</span>
              </li>
              <li className="flex items-start">
                <span className="text-logo-dark-blue mr-2">✓</span>
                <span>Post detailed project specifications</span>
              </li>
              <li className="flex items-start">
                <span className="text-logo-dark-blue mr-2">✓</span>
                <span>Review freelancer profiles with verified credentials</span>
              </li>
              <li className="flex items-start">
                <span className="text-logo-dark-blue mr-2">✓</span>
                <span>Communicate securely with potential hires</span>
              </li>
            </ul>
            <Link to="/auth/signup/business">
              <Button className="w-full bg-logo-dark-blue text-white hover:bg-logo-dark-blue/90">
                Sign Up as a Business
              </Button>
            </Link>
          </div>
          
          <div className="md:w-1/2 bg-white rounded-lg shadow-md p-8">
            <h3 className="font-heading text-2xl font-semibold mb-4 text-logo-dark-green">For Freelance Professionals</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-logo-dark-green mr-2">✓</span>
                <span>Discover relevant construction projects</span>
              </li>
              <li className="flex items-start">
                <span className="text-logo-dark-green mr-2">✓</span>
                <span>Purchase leads using a flexible credit system</span>
              </li>
              <li className="flex items-start">
                <span className="text-logo-dark-green mr-2">✓</span>
                <span>Showcase your qualifications and experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-logo-dark-green mr-2">✓</span>
                <span>Build long-term client relationships</span>
              </li>
            </ul>
            <Link to="/auth/signup/freelancer">
              <Button className="w-full bg-logo-dark-green text-white hover:bg-logo-dark-green/90">
                Sign Up as a Freelancer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserSegments;
