
import React from 'react';
import { Calendar, Briefcase } from 'lucide-react';

interface ProfileMetadataSectionProps {
  formattedMemberSince: string;
  jobsCompleted: number;
}

const ProfileMetadataSection: React.FC<ProfileMetadataSectionProps> = ({
  formattedMemberSince,
  jobsCompleted
}) => {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Calendar className="h-3.5 w-3.5" />
        <span>Member since {formattedMemberSince}</span>
      </div>
      
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Briefcase className="h-3.5 w-3.5" />
        <span>{jobsCompleted} {jobsCompleted === 1 ? 'job' : 'jobs'} completed</span>
      </div>
    </div>
  );
};

export default ProfileMetadataSection;
