
import React from 'react';
import { 
  formatDate, 
  formatRole, 
  formatBudget, 
  formatDuration, 
  formatLocation, 
  formatWorkType 
} from '@/utils/projectFormatters';

interface MetadataItemProps {
  label: string;
  value: string;
}

const MetadataItem = ({ label, value }: MetadataItemProps) => (
  <div className="space-y-1">
    <h4 className="font-medium text-sm text-muted-foreground">{label}</h4>
    <p className="font-medium">{value}</p>
  </div>
);

interface ProjectMetadataProps {
  created_at: string | null;
  start_date: string | null;
  role: string;
  budget: string;
  duration: string;
  location: string;
  work_type: string;
}

const ProjectMetadata = ({
  created_at,
  start_date,
  role,
  budget,
  duration,
  location,
  work_type,
}: ProjectMetadataProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <MetadataItem label="Posted Date" value={formatDate(created_at)} />
      <MetadataItem label="Start Date" value={formatDate(start_date)} />
      <MetadataItem label="Role" value={formatRole(role)} />
      <MetadataItem label="Budget" value={formatBudget(budget)} />
      <MetadataItem label="Duration" value={formatDuration(duration)} />
      <MetadataItem label="Location" value={formatLocation(location)} />
      <MetadataItem label="Work Type" value={formatWorkType(work_type)} />
    </div>
  );
};

export default ProjectMetadata;
