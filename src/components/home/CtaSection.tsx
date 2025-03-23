
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CtaSection = () => {
  return (
    <section className="py-16 bg-logo-dark-blue text-white">
      <div className="container px-4 mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Join BuildWise UK today and transform how you connect in the construction industry.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/auth/signup/business">
            <Button className="w-full sm:w-auto bg-white text-logo-dark-blue hover:bg-gray-100">
              Post a Project
            </Button>
          </Link>
          <Link to="/auth/signup/freelancer">
            <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
              Find Work
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
