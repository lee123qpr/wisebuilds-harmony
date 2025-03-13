
import React from 'react';

interface RequirementItemProps {
  title: string;
  isRequired: boolean;
}

const RequirementItem = ({ title, isRequired }: RequirementItemProps) => (
  <div className="border rounded-md p-3 bg-muted/20">
    <h4 className="text-sm font-medium">{title}</h4>
    <p className="text-sm mt-1 font-medium">
      {isRequired ? 'Yes' : 'No'}
    </p>
  </div>
);

interface ProjectRequirementsProps {
  requires_insurance: boolean;
  requires_equipment: boolean;
  requires_site_visits: boolean;
}

const ProjectRequirements = ({
  requires_insurance,
  requires_equipment,
  requires_site_visits,
}: ProjectRequirementsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <RequirementItem 
        title="Insurance Required" 
        isRequired={requires_insurance} 
      />
      <RequirementItem 
        title="Equipment Required" 
        isRequired={requires_equipment} 
      />
      <RequirementItem 
        title="Site Visits Required" 
        isRequired={requires_site_visits} 
      />
    </div>
  );
};

export default ProjectRequirements;
