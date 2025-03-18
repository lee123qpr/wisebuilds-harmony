
import React from 'react';
import { Calendar, Briefcase, MapPin } from 'lucide-react';
import { FreelancerProfile } from '@/types/applications';
import { format, parseISO } from 'date-fns';

interface FreelancerMetadataProps {
  profile?: FreelancerProfile;
}

const FreelancerMetadata: React.FC<FreelancerMetadataProps> = ({ profile }) => {
  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return 'Recently joined';
    try {
      return format(parseISO(dateString), 'MMMM yyyy');
    } catch (e) {
      return 'Recently joined';
    }
  };

  return (
    <div className="mt-3 space-y-1.5">
      <div className="flex items-center text-sm text-muted-foreground">
        <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
        Member since {formatMemberSince(profile?.member_since)}
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground">
        <Briefcase className="h-4 w-4 mr-1.5 flex-shrink-0" />
        {profile?.jobs_completed || 0} jobs completed
      </div>
      
      {profile?.location && (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
          {profile.location}
        </div>
      )}
    </div>
  );
};

export default FreelancerMetadata;
