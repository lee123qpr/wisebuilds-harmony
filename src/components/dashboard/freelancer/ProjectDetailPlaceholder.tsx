
import React from 'react';
import { Briefcase } from 'lucide-react';

const ProjectDetailPlaceholder: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
    <div className="rounded-full bg-primary/10 p-4 mb-4">
      <Briefcase className="h-8 w-8 text-primary" />
    </div>
    <h3 className="text-xl font-medium mb-2">Select a project</h3>
    <p className="text-muted-foreground max-w-md">
      Choose a project from the list to view detailed information and requirements
    </p>
  </div>
);

export default ProjectDetailPlaceholder;
