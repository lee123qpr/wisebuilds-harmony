
import React from 'react';

interface ProjectInfoProps {
  projectTitle: string;
  clientName: string;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ projectTitle, clientName }) => {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold">Project: {projectTitle}</h2>
      <p className="text-sm text-muted-foreground mb-2">
        Client: {clientName}
      </p>
      <p className="text-sm text-muted-foreground">
        Provide details of your proposal to the client
      </p>
    </div>
  );
};

export default ProjectInfo;
