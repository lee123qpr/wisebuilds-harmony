
import React from 'react';
import { HardHat, ClipboardList, Search, BriefcaseBusiness, MessageSquare, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FreelancerSteps = () => {
  const steps = [
    {
      icon: <HardHat className="h-10 w-10 text-logo-dark-blue" />,
      title: 'Create Your Profile',
      description: 'Sign up and build a detailed profile showcasing your skills, experience, qualifications, and portfolio. A complete profile increases your chances of attracting quality projects.'
    },
    {
      icon: <Search className="h-10 w-10 text-logo-dark-blue" />,
      title: 'Discover Projects',
      description: 'Browse available projects or set up tailored lead alerts. Our intelligent matching system notifies you of projects that match your skills and preferences.'
    },
    {
      icon: <BriefcaseBusiness className="h-10 w-10 text-logo-dark-blue" />,
      title: 'Submit Quotes',
      description: 'When you find a suitable project, submit a competitive quote detailing your proposed approach, timeline, and cost. Stand out by highlighting relevant experience.'
    },
    {
      icon: <MessageSquare className="h-10 w-10 text-logo-dark-blue" />,
      title: 'Communicate & Connect',
      description: 'If a client is interested, they\'ll reach out to discuss details. Our secure messaging system facilitates clear communication and documentation.'
    },
    {
      icon: <ClipboardList className="h-10 w-10 text-logo-dark-blue" />,
      title: 'Complete the Project',
      description: 'Once hired, deliver high-quality work according to the agreed terms. Use our platform to track progress, share updates, and manage documentation.'
    },
    {
      icon: <Star className="h-10 w-10 text-logo-dark-blue" />,
      title: 'Build Your Reputation',
      description: 'After completion, clients can leave reviews based on your performance. Positive feedback helps build your reputation and attracts more opportunities.'
    }
  ];
  
  return (
    <div className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-10">
          <HardHat className="h-8 w-8 mr-3 text-logo-dark-blue" />
          <h2 className="text-3xl font-heading font-bold">For Construction Professionals</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-300 border-t-4 border-t-logo-light-blue">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="flex-shrink-0 mr-3 flex items-center justify-center bg-bw-off-white rounded-full w-12 h-12">
                    <span className="text-logo-dark-blue font-bold text-xl">{index + 1}</span>
                  </div>
                  <div className="flex-shrink-0">{step.icon}</div>
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-bw-gray-medium">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FreelancerSteps;
