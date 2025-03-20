
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Briefcase, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { FreelancerApplication } from '@/types/applications';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VerificationBadge from '@/components/common/VerificationBadge';
import ProfileRatingStars from '@/pages/freelancer/components/ProfileRatingStars';
import FreelancerProfileLink from '@/pages/project/components/FreelancerProfileLink';

interface FreelancerApplicationCardProps {
  application: FreelancerApplication;
  projectId: string;
}

const FreelancerApplicationCard: React.FC<FreelancerApplicationCardProps> = ({ application, projectId }) => {
  const formattedDate = application.created_at ? format(new Date(application.created_at), 'MMMM dd, yyyy') : 'N/A';
  
  // Get profile info from the nested freelancer_profile and provide proper type checking
  const profile = application.freelancer_profile || {
    display_name: '',
    first_name: '',
    last_name: '',
    profile_photo: '',
    job_title: '',
    email_verified: false,
    verified: false,
    rating: 0,
    reviews_count: 0,
    skills: [],
  };

  const getInitials = () => {
    if (profile.display_name) {
      return profile.display_name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    } else if (profile.first_name && profile.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return 'NF'; // Default: No Freelancer
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-24 w-24 border">
            <AvatarImage src={profile.profile_photo || undefined} alt={profile.display_name || 'Freelancer'} />
            <AvatarFallback className="text-lg bg-slate-100 text-slate-600 font-semibold">{getInitials()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold">{profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`}</h3>
                <ProfileRatingStars 
                  userId={application.user_id}
                  rating={profile.rating}
                  reviewsCount={profile.reviews_count}
                />
              </div>
              <p className="text-muted-foreground">{profile.job_title || 'Freelancer'}</p>
              <div className="flex gap-2 mt-2">
                <VerificationBadge 
                  type="email" 
                  status={profile.email_verified ? 'verified' : 'pending'} 
                />
                <VerificationBadge 
                  type="id" 
                  status={profile.verified ? 'verified' : 'pending'} 
                />
              </div>
            </div>
            
            <p>{application.message}</p>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {profile.skills && profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3 pt-2">
              <FreelancerProfileLink 
                freelancerId={application.user_id} 
                projectId={projectId}
              >
                View Profile
              </FreelancerProfileLink>
              <Button variant="outline">Contact</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerApplicationCard;
