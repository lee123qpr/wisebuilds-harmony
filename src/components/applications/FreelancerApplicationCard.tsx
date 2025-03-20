
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FreelancerApplication } from '@/types/applications';
import { format } from 'date-fns';
import FreelancerAvatar from './FreelancerAvatar';
import RatingStars from '@/components/common/RatingStars';
import FreelancerMetadata from './FreelancerMetadata';
import FreelancerContactInfo from './FreelancerContactInfo';
import FreelancerApplicationActions from './FreelancerApplicationActions';

interface FreelancerApplicationCardProps {
  application: FreelancerApplication;
  projectId: string;
}

const FreelancerApplicationCard: React.FC<FreelancerApplicationCardProps> = ({ 
  application, 
  projectId 
}) => {
  const profile = application.freelancer_profile;
  const applicationDate = format(new Date(application.created_at), 'dd MMM yyyy');

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <FreelancerAvatar profile={profile} />
          
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <h3 className="text-xl font-semibold">{profile?.display_name || 'Freelancer'}</h3>
                <RatingStars 
                  rating={profile?.rating || null} 
                  reviewCount={profile?.reviews_count || 0} 
                />
              </div>
              
              <p className="text-muted-foreground">{profile?.job_title || 'Freelancer'}</p>
              
              <FreelancerMetadata profile={profile} />
            </div>
            
            {application.message && (
              <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                <p className="font-medium mb-1">Application message:</p>
                <p className="text-sm">{application.message}</p>
              </div>
            )}
            
            <FreelancerContactInfo profile={profile} />
            
            <FreelancerApplicationActions profile={profile} projectId={projectId} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerApplicationCard;
