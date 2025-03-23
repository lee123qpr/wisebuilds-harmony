
import React from 'react';
import { Calendar, Briefcase, MapPin } from 'lucide-react';
import { FreelancerProfile } from '@/types/applications';
import { format, parseISO } from 'date-fns';

interface FreelancerMetadataProps {
  profile?: FreelancerProfile;
  compact?: boolean;
}

const FreelancerMetadata: React.FC<FreelancerMetadataProps> = ({ profile, compact = false }) => {
  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return 'Recently joined';
    try {
      return format(parseISO(dateString), compact ? 'MMM yyyy' : 'MMMM yyyy');
    } catch (e) {
      return 'Recently joined';
    }
  };

  // Base classes for items
  const itemClasses = "flex items-center text-sm text-muted-foreground";
  const iconClasses = "mr-1.5 flex-shrink-0";
  const iconSize = "h-4 w-4";

  return (
    <div className={compact ? "flex gap-3 flex-wrap" : "space-y-1.5"}>
      <div className={itemClasses}>
        <Calendar className={`${iconClasses} ${iconSize}`} />
        <span>Member since {formatMemberSince(profile?.member_since)}</span>
      </div>
      
      <div className={itemClasses}>
        <Briefcase className={`${iconClasses} ${iconSize}`} />
        <span>{profile?.jobs_completed || 0} {profile?.jobs_completed === 1 ? 'job' : 'jobs'} completed</span>
      </div>
      
      {profile?.location && (
        <div className={itemClasses}>
          <MapPin className={`${iconClasses} ${iconSize}`} />
          <span>{profile.location}</span>
        </div>
      )}
    </div>
  );
};

export default FreelancerMetadata;
