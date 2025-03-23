
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import QuoteFreelancerProfileCard from '@/pages/project/components/quotes/FreelancerProfileCard';
import MessagesFreelancerProfile from '@/components/quotes/components/FreelancerProfile';
import FreelancerInfoCell from '@/components/quotes/table/FreelancerInfoCell';

interface QuoteCardsProps {
  completeFreelancer: any;
  minimalFreelancer: any;
  newFreelancer: any;
  expertFreelancer: any;
  mockQuoteDate: string;
}

const QuoteCards: React.FC<QuoteCardsProps> = ({
  completeFreelancer,
  minimalFreelancer,
  newFreelancer,
  expertFreelancer,
  mockQuoteDate
}) => {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Quote Freelancer Profile Card - Various Users</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Experienced Freelancer</h3>
            <QuoteFreelancerProfileCard
              freelancer={completeFreelancer}
              quoteDate={mockQuoteDate}
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">New Freelancer</h3>
            <QuoteFreelancerProfileCard
              freelancer={newFreelancer}
              quoteDate={mockQuoteDate}
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Minimal Profile</h3>
            <QuoteFreelancerProfileCard
              freelancer={minimalFreelancer}
              quoteDate={mockQuoteDate}
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Expert Freelancer</h3>
            <QuoteFreelancerProfileCard
              freelancer={expertFreelancer}
              quoteDate={mockQuoteDate}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Messages Freelancer Profile - Various States</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Complete Profile</h3>
            <MessagesFreelancerProfile
              freelancerName={completeFreelancer.display_name}
              profilePhoto={completeFreelancer.profile_photo}
              jobTitle={completeFreelancer.job_title}
              isVerified={completeFreelancer.verified}
              isLoadingFreelancer={false}
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">No Profile Photo</h3>
            <MessagesFreelancerProfile
              freelancerName={minimalFreelancer.display_name}
              profilePhoto={minimalFreelancer.profile_photo}
              jobTitle={minimalFreelancer.job_title || 'Freelancer'}
              isVerified={minimalFreelancer.verified}
              isLoadingFreelancer={false}
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Not Verified</h3>
            <MessagesFreelancerProfile
              freelancerName={newFreelancer.display_name}
              profilePhoto={newFreelancer.profile_photo}
              jobTitle={newFreelancer.job_title}
              isVerified={newFreelancer.verified}
              isLoadingFreelancer={false}
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Loading State</h3>
            <MessagesFreelancerProfile
              freelancerName="Loading..."
              profilePhoto={undefined}
              jobTitle="Loading..."
              isVerified={false}
              isLoadingFreelancer={true}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quotes Table Freelancer Info Cell</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Complete Profile</h3>
            <FreelancerInfoCell
              freelancer={completeFreelancer}
              freelancerId={completeFreelancer.id}
              isLoading={false}
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">New User</h3>
            <FreelancerInfoCell
              freelancer={newFreelancer}
              freelancerId={newFreelancer.id}
              isLoading={false}
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Minimal Information</h3>
            <FreelancerInfoCell
              freelancer={minimalFreelancer}
              freelancerId={minimalFreelancer.id}
              isLoading={false}
            />
          </div>
          
          <div className="border p-4 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Loading State</h3>
            <FreelancerInfoCell
              freelancer={{}}
              freelancerId="loading"
              isLoading={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteCards;
