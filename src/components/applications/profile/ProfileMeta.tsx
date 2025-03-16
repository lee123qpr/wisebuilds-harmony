
import React from 'react';
import { Calendar, Briefcase, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface ProfileMetaProps {
  memberSince?: string;
  jobsCompleted?: number;
  location?: string;
}

export const ProfileMeta: React.FC<ProfileMetaProps> = ({ 
  memberSince, 
  jobsCompleted = 0,
  location
}) => {
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
        Member since {formatMemberSince(memberSince)}
      </div>
      
      <div className="flex items-center text-sm text-muted-foreground">
        <Briefcase className="h-4 w-4 mr-1.5 flex-shrink-0" />
        {jobsCompleted} jobs completed
      </div>
      
      {location && (
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
          {location}
        </div>
      )}
    </div>
  );
};
