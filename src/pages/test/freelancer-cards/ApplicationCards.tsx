
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import ApplicationFreelancerCard from '@/components/applications/FreelancerApplicationCard';
import FreelancerAvatar from '@/components/applications/FreelancerAvatar';

interface ApplicationCardsProps {
  completeFreelancer: any;
  minimalFreelancer: any;
  newFreelancer: any;
  expertFreelancer: any;
  mockProjectId: string;
}

const ApplicationCards: React.FC<ApplicationCardsProps> = ({
  completeFreelancer,
  minimalFreelancer,
  newFreelancer,
  expertFreelancer,
  mockProjectId
}) => {
  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Application Card - Complete Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationFreelancerCard
            application={{
              id: 'app-123',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: completeFreelancer.id,
              project_id: mockProjectId,
              message: 'I am interested in this project and would love to discuss further. I have extensive experience in this type of work and can start immediately.',
              freelancer_profile: completeFreelancer
            }}
            projectId={mockProjectId}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Application Card - Minimal Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationFreelancerCard
            application={{
              id: 'app-124',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              user_id: minimalFreelancer.id,
              project_id: mockProjectId,
              message: 'I would like to apply for this project.',
              freelancer_profile: minimalFreelancer
            }}
            projectId={mockProjectId}
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Avatar Component - Various States</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-10 justify-around">
            <div className="flex flex-col items-center">
              <h3 className="mb-2 font-medium">With Profile Photo</h3>
              <FreelancerAvatar profile={completeFreelancer} />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="mb-2 font-medium">Without Profile Photo</h3>
              <FreelancerAvatar profile={minimalFreelancer} />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="mb-2 font-medium">Verified User</h3>
              <FreelancerAvatar profile={expertFreelancer} />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="mb-2 font-medium">Email Verified Only</h3>
              <FreelancerAvatar profile={newFreelancer} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationCards;
