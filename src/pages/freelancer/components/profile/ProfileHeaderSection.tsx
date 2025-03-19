
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CheckCircle2, Calendar, Briefcase, MapPin, Mail, Phone } from 'lucide-react';
import { FreelancerProfile } from '@/types/applications';
import { format, parseISO } from 'date-fns';
import ProfileRatingStars from '../ProfileRatingStars';

interface ProfileHeaderSectionProps {
  profile: FreelancerProfile;
}

const ProfileHeaderSection: React.FC<ProfileHeaderSectionProps> = ({ profile }) => {
  const getInitials = (name?: string) => {
    if (!name) return 'FL';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return 'Recently joined';
    try {
      return format(parseISO(dateString), 'MMMM yyyy');
    } catch (e) {
      return 'Recently joined';
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.profile_photo} alt={profile.display_name} />
          <AvatarFallback>{getInitials(profile.display_name)}</AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col items-center gap-1">
          {profile.email_verified && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Email Verified
            </Badge>
          )}
          
          {profile.verified && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              ID Verified
            </Badge>
          )}
        </div>
        
        <div className="text-center">
          <ProfileRatingStars rating={profile.rating} reviewsCount={profile.reviews_count} />
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
          Member since {formatMemberSince(profile.member_since)}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <Briefcase className="h-4 w-4 mr-1.5 flex-shrink-0" />
          {profile.jobs_completed || 0} jobs completed
        </div>
      </div>
      
      <div className="flex-1">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{profile.display_name || 'Freelancer'}</h2>
          <p className="text-muted-foreground">{profile.job_title || 'Freelancer'}</p>
          
          {profile.location && (
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
              {profile.location}
            </div>
          )}
        </div>
        
        {profile.bio && (
          <div className="bg-slate-50 p-4 rounded-md mb-4">
            <p className="font-medium mb-1">Bio:</p>
            <p className="text-sm">{profile.bio}</p>
          </div>
        )}
        
        <div className="space-y-2">
          <p className="font-medium">Contact information:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {profile.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href={`mailto:${profile.email}`} className="text-sm text-blue-600 hover:underline">{profile.email}</a>
              </div>
            )}
            
            {profile.phone_number && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <a href={`tel:${profile.phone_number}`} className="text-sm text-blue-600 hover:underline">{profile.phone_number}</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderSection;
