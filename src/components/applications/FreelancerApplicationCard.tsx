
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
import FreelancerMetadata from '@/components/applications/FreelancerMetadata';
import FreelancerContactInfo from '@/components/applications/FreelancerContactInfo';

interface FreelancerApplicationCardProps {
  application: FreelancerApplication;
  projectId: string;
}

const FreelancerApplicationCard: React.FC<FreelancerApplicationCardProps> = ({ application, projectId }) => {
  const formattedDate = application.created_at ? format(new Date(application.created_at), 'MMMM dd, yyyy') : 'N/A';
  
  // Get profile info from the nested freelancer_profile and provide proper type checking
  const profile = application.freelancer_profile || {
    id: '',
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
    location: '',
    member_since: '',
    jobs_completed: 0
  };

  // Log profile data for debugging
  console.log('FreelancerApplicationCard - Freelancer profile data:', { 
    userId: application.user_id,
    profile: profile,
    rating: profile.rating,
    reviews_count: profile.reviews_count
  });

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
          <div className="flex flex-col items-center">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={profile.profile_photo || undefined} alt={profile.display_name || 'Freelancer'} />
              <AvatarFallback className="text-lg bg-slate-100 text-slate-600 font-semibold">{getInitials()}</AvatarFallback>
            </Avatar>
            
            {/* Contact info section - only shown on applications page */}
            <div className="w-full mt-4">
              <FreelancerContactInfo profile={profile} />
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold">{profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`}</h3>
                  <p className="text-muted-foreground">{profile.job_title || 'Freelancer'}</p>
                </div>
                <ProfileRatingStars 
                  userId={application.user_id}
                  rating={profile.rating}
                  reviewsCount={profile.reviews_count}
                />
              </div>
              
              <FreelancerMetadata profile={profile} />
              
              <div className="flex flex-wrap gap-2 mt-3">
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
            
            {application.message && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">{application.message}</p>
              </div>
            )}
            
            {profile.skills && profile.skills.length > 0 && (
              <div className="mt-3">
                <h4 className="text-sm font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-3 pt-3">
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
