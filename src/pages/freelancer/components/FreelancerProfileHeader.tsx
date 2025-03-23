
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FreelancerProfile } from '@/types/applications';
import VerificationBadge from '@/components/common/VerificationBadge';
import ProfileRatingStars from './ProfileRatingStars';
import FreelancerMetadata from '@/components/freelancer/FreelancerMetadata';

interface FreelancerProfileHeaderProps {
  profile: FreelancerProfile;
}

const FreelancerProfileHeader: React.FC<FreelancerProfileHeaderProps> = ({ profile }) => {
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
    return 'FP'; // Default: Freelancer Profile
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Avatar className="h-24 w-24 border">
          <AvatarImage src={profile.profile_photo || undefined} alt={profile.display_name || 'Freelancer'} />
          <AvatarFallback className="text-lg bg-slate-100 text-slate-600 font-semibold">{getInitials()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
            <div>
              <h1 className="text-2xl font-semibold mb-1">{profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`}</h1>
              <p className="text-muted-foreground">{profile.job_title || 'Freelancer'}</p>
            </div>
            
            <div>
              <ProfileRatingStars 
                userId={profile.id}
                rating={profile.rating}
                reviewsCount={profile.reviews_count}
              />
            </div>
          </div>
          
          <div className="mt-4">
            {/* Use the standardized FreelancerMetadata component */}
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
        </div>
      </div>
    </div>
  );
};

export default FreelancerProfileHeader;
