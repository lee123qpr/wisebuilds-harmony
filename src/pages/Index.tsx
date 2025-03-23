
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';

const RoleWordRotator = () => {
  const roles = [
    "Architects", 
    "Engineers", 
    "Surveyors", 
    "Project Managers", 
    "Contractors", 
    "Specialists"
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % roles.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <span className="text-logo-dark-green font-bold">{roles[currentIndex]}</span>
  );
};

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
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

      {/* How It Works Section */}
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

      {/* For Businesses & Freelancers */}
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

      {/* Testimonials */}
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

      {/* CTA Section */}
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
    </MainLayout>
  );
};

export default Index;
