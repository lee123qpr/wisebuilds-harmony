
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import QuoteDetailsCard from '@/pages/project/components/quotes/QuoteDetailsCard';
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
  // Create a mock quote for testing
  const mockQuote = {
    id: 'quote-123',
    status: 'pending',
    created_at: mockQuoteDate,
    project_id: 'project-123',
    freelancer_id: completeFreelancer.id,
    client_id: 'client-123',
    fixed_price: 1000,
    day_rate: null,
    estimated_price: null,
    available_start_date: new Date().toISOString(),
    estimated_duration: 14,
    duration_unit: 'days',
    payment_terms: 'half upfront, half on completion',
    description: 'This is a detailed quote description outlining the work that will be done for this project.'
  };

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Quote Details Card - Complete Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteDetailsCard
            quote={mockQuote}
            freelancer={completeFreelancer}
            onAcceptQuote={async () => console.log('Accept quote')}
            onRejectQuote={async () => console.log('Reject quote')}
            isAccepting={false}
            isRejecting={false}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quote Details Card - Minimal Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <QuoteDetailsCard
            quote={mockQuote}
            freelancer={minimalFreelancer}
            onAcceptQuote={async () => console.log('Accept quote')}
            onRejectQuote={async () => console.log('Reject quote')}
            isAccepting={false}
            isRejecting={false}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Info Cell - Various States</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <h3 className="mb-2 font-medium">Complete Profile</h3>
              <FreelancerInfoCell
                freelancer={completeFreelancer}
                freelancerId={completeFreelancer.id}
              />
            </div>
            <div className="p-4 border rounded">
              <h3 className="mb-2 font-medium">Minimal Profile</h3>
              <FreelancerInfoCell
                freelancer={minimalFreelancer}
                freelancerId={minimalFreelancer.id}
              />
            </div>
            <div className="p-4 border rounded">
              <h3 className="mb-2 font-medium">Expert Profile</h3>
              <FreelancerInfoCell
                freelancer={expertFreelancer}
                freelancerId={expertFreelancer.id}
              />
            </div>
            <div className="p-4 border rounded">
              <h3 className="mb-2 font-medium">Loading State</h3>
              <FreelancerInfoCell
                freelancer={{}}
                freelancerId="loading-id"
                isLoading={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteCards;
