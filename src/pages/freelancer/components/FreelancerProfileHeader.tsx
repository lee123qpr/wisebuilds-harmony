
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Briefcase, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { FreelancerProfile } from '@/types/applications';
import VerificationBadge from '@/components/common/VerificationBadge';
import ProfileRatingStars from './ProfileRatingStars';

interface FreelancerProfileHeaderProps {
  profile: FreelancerProfile;
}

const FreelancerProfileHeader: React.FC<FreelancerProfileHeaderProps> = ({ profile }) => {
  // Format the member_since date if available
  const formattedMemberSince = profile.member_since 
    ? format(new Date(profile.member_since), 'MMMM yyyy')
    : 'Recently joined';

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

  console.log('FreelancerProfileHeader - profile details:', { 
    id: profile.id,
    rating: profile.rating,
    reviews_count: profile.reviews_count
  });

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
            
            {/* Display rating stars using ProfileRatingStars for consistency */}
            <div>
              <ProfileRatingStars 
                userId={profile.id}
                rating={profile.rating}
                reviewsCount={profile.reviews_count}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex flex-wrap gap-4 mb-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since {formattedMemberSince}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{profile.jobs_completed || 0} {profile.jobs_completed === 1 ? 'job' : 'jobs'} completed</span>
              </div>
              
              {profile.location && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>
            
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
