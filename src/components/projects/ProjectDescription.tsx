
import React from 'react';

interface ProjectDescriptionProps {
  description: string | null;
}

const ProjectDescription = ({ description }: ProjectDescriptionProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium">Description</h3>
      <p className="mt-2 text-muted-foreground whitespace-pre-wrap break-words">
        {description || 'No description provided.'}
      </p>
    </div>
  );
};

export default ProjectDescription;
