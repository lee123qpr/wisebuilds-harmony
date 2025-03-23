
import React from 'react';
import { Building2, ClipboardCheck, Users, FileText, MessageCircle, ThumbsUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ClientSteps = () => {
  const steps = [
    {
      icon: <Building2 className="h-10 w-10 text-logo-dark-green" />,
      title: 'Create Your Business Profile',
      description: 'Sign up and create a business profile that showcases your company, projects, and requirements. A complete profile helps attract qualified professionals.'
    },
    {
      icon: <ClipboardCheck className="h-10 w-10 text-logo-dark-green" />,
      title: 'Post Your Project',
      description: 'Create a detailed project listing including scope, timeline, budget, location, and specific requirements. The more detail you provide, the better matches you\'ll receive.'
    },
    {
      icon: <Users className="h-10 w-10 text-logo-dark-green" />,
      title: 'Review Qualified Professionals',
      description: 'Browse applications from interested professionals or use our matching system to find verified experts that meet your specific needs and criteria.'
    },
    {
      icon: <FileText className="h-10 w-10 text-logo-dark-green" />,
      title: 'Compare Quotes',
      description: 'Review and compare quotes from different professionals. Evaluate their experience, approach, timeline, and pricing to find the best fit for your project.'
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-logo-dark-green" />,
      title: 'Connect & Discuss Details',
      description: 'Contact promising candidates through our secure messaging system to discuss details, clarify expectations, and finalize arrangements.'
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-logo-dark-green" />,
      title: 'Hire & Manage the Project',
      description: 'Hire your chosen professional and use our platform to manage communications, track progress, share documents, and complete the project successfully.'
    }
  ];
  
  return (
    <div className="py-16 px-4 bg-bw-off-white">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center mb-10">
          <Building2 className="h-8 w-8 mr-3 text-logo-dark-green" />
          <h2 className="text-3xl font-heading font-bold">For Construction Businesses</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-300 border-t-4 border-t-logo-light-green">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="flex-shrink-0 mr-3 flex items-center justify-center bg-white rounded-full w-12 h-12">
                    <span className="text-logo-dark-green font-bold text-xl">{index + 1}</span>
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

export default ClientSteps;
