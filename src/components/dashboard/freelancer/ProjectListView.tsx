
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Project } from '@/components/projects/useProjects';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { formatDate, formatBudget, formatDuration, formatRole, formatWorkType } from '@/utils/projectFormatters';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Briefcase, Clock, Tag, Building, Users, Calendar as CalendarIcon } from 'lucide-react';

interface ProjectListViewProps {
  projects: Project[];
  isLoading: boolean;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string) => void;
  selectedProject: Project | null;
}

const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  isLoading,
  selectedProjectId,
  setSelectedProjectId,
  selectedProject
}) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 px-6 text-center">
          <h3 className="text-xl font-medium mb-2">No projects available</h3>
          <p className="text-muted-foreground">There are currently no available projects that match your criteria.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border bg-white">
      <ResizablePanel defaultSize={40} minSize={30}>
        <div className="divide-y h-[700px] overflow-auto">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isSelected={project.id === selectedProjectId}
              onClick={() => setSelectedProjectId(project.id)}
            />
          ))}
        </div>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={60}>
        {selectedProject ? (
          <div className="p-6 h-[700px] overflow-auto">
            <ProjectDetails project={selectedProject} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Select a project</h3>
            <p className="text-muted-foreground max-w-md">
              Choose a project from the list to view detailed information and requirements
            </p>
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

interface ProjectCardProps {
  project: Project;
  isSelected: boolean;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, isSelected, onClick }) => {
  // Format dates
  const postedDate = formatDate(project.created_at);
  const startDate = formatDate(project.start_date);
  const hiringStatus = project.hiring_status || 'active';
  
  return (
    <div 
      className={`p-5 cursor-pointer transition-all ${
        isSelected 
          ? 'bg-primary/5 border-l-4 border-primary' 
          : 'hover:bg-muted/50 border-l-4 border-transparent'
      }`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-lg truncate">{project.title}</h3>
      
      <div className="space-y-3 mt-3">
        {/* Location */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
            <MapPin className="h-4 w-4 text-blue-600" />
          </span>
          <span className="text-sm text-blue-600 font-medium">{project.location}</span>
        </div>
        
        {/* Budget */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
            <Tag className="h-4 w-4 text-green-600" />
          </span>
          <span className="text-sm text-green-600 font-medium">{formatBudget(project.budget)}</span>
        </div>
        
        {/* Duration */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100">
            <Clock className="h-4 w-4 text-purple-600" />
          </span>
          <span className="text-sm text-purple-600 font-medium">{formatDuration(project.duration)}</span>
        </div>
        
        {/* Role */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100">
            <Users className="h-4 w-4 text-orange-600" />
          </span>
          <span className="text-sm text-orange-600 font-medium">{formatRole(project.role)}</span>
        </div>
        
        {/* Work Type */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-100">
            <Briefcase className="h-4 w-4 text-teal-600" />
          </span>
          <span className="text-sm text-teal-600 font-medium">{formatWorkType(project.work_type)}</span>
        </div>
        
        {/* Posted Date */}
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100">
            <CalendarIcon className="h-4 w-4 text-indigo-600" />
          </span>
          <span className="text-sm text-indigo-600 font-medium">Posted {postedDate}</span>
        </div>
        
        {/* Hiring Status */}
        <div className="flex items-center gap-2 mt-2">
          <Badge className={`
            ${hiringStatus === 'active' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 
              hiringStatus === 'pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 
              hiringStatus === 'closed' ? 'bg-red-100 text-red-700 hover:bg-red-200' : 
              'bg-blue-100 text-blue-700 hover:bg-blue-200'}
            border-none rounded-full px-3 py-1
          `}>
            {hiringStatus.charAt(0).toUpperCase() + hiringStatus.slice(1)}
          </Badge>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <ResizablePanelGroup direction="horizontal" className="rounded-lg border bg-white">
    <ResizablePanel defaultSize={40} minSize={30}>
      <div className="divide-y h-[700px] overflow-auto p-4 space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <div className="flex gap-4 mb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-12 w-full mb-2" />
            <div className="flex gap-2 mt-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </ResizablePanel>
    
    <ResizableHandle withHandle />
    
    <ResizablePanel defaultSize={60}>
      <div className="p-6 h-[700px] overflow-auto space-y-6">
        <Skeleton className="h-10 w-1/2 mb-4" />
        <Skeleton className="h-6 w-1/3 mb-2" />
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-6 w-1/4 mb-2" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
);

export default ProjectListView;
