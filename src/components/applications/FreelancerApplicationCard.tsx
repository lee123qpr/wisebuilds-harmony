import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Briefcase, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Application } from '@/types/applications';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VerificationBadge from '@/components/common/VerificationBadge';
import ProfileRatingStars from '@/pages/freelancer/components/ProfileRatingStars';

interface FreelancerApplicationCardProps {
  application: Application;
  projectId: string;
}

const FreelancerApplicationCard: React.FC<FreelancerApplicationCardProps> = ({ application, projectId }) => {
  const formattedDate = application.created_at ? format(new Date(application.created_at), 'MMMM dd, yyyy') : 'N/A';

  const getInitials = () => {
    if (application.freelancer_display_name) {
      return application.freelancer_display_name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    } else if (application.freelancer_first_name && application.freelancer_last_name) {
      return `${application.freelancer_first_name[0]}${application.freelancer_last_name[0]}`.toUpperCase();
    }
    return 'NF'; // Default: No Freelancer
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-24 w-24 border">
            <AvatarImage src={application.freelancer_profile_photo || undefined} alt={application.freelancer_display_name || 'Freelancer'} />
            <AvatarFallback className="text-lg bg-slate-100 text-slate-600 font-semibold">{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold">{application.freelancer_display_name || `${application.freelancer_first_name || ''} ${application.freelancer_last_name || ''}`}</h3>
                <ProfileRatingStars 
                  userId={application.freelancer_id}
                  rating={application.freelancer_rating}
                  reviewsCount={application.freelancer_reviews_count}
                />
              </div>
              <p className="text-muted-foreground">{application.freelancer_job_title || 'Freelancer'}</p>
              <div className="flex gap-2 mt-2">
                <VerificationBadge 
                  type="email" 
                  status={application.freelancer_email_verified ? 'verified' : 'pending'} 
                />
                <VerificationBadge 
                  type="id" 
                  status={application.freelancer_verified ? 'verified' : 'pending'} 
                />
              </div>
            </div>
            
            <p>{application.cover_letter}</p>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {application.freelancer_skills && application.freelancer_skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <Button as={Link} to={`/freelancer/${application.freelancer_id}`} state={{ from: 'projectApplications', projectId: projectId }}>
                View Profile
              </Button>
              <Button variant="outline">Contact</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerApplicationCard;
