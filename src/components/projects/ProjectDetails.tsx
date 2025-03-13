
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Project } from '@/components/projects/useProjects';

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  // Helper functions to format data
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const formatRole = (role: string) => {
    if (!role) return 'Not specified';
    return role
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatBudget = (budget: string) => {
    if (!budget) return 'Not specified';
    if (budget === 'under_1000') return 'Under £1,000';
    if (budget === '1000_to_5000') return '£1,000 - £5,000';
    if (budget === '5000_to_10000') return '£5,000 - £10,000';
    if (budget === '10000_to_50000') return '£10,000 - £50,000';
    if (budget === '50000_to_100000') return '£50,000 - £100,000';
    if (budget === '100000_plus') return 'Over £100,000';
    
    return budget
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDuration = (duration: string) => {
    if (!duration) return 'Not specified';
    return duration
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatLocation = (location: string) => {
    if (!location) return 'Not specified';
    return location.charAt(0).toUpperCase() + location.slice(1);
  };

  const formatWorkType = (workType: string) => {
    if (!workType) return 'Not specified';
    return workType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>All information about this project</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Description</h3>
          <p className="mt-2 text-muted-foreground whitespace-pre-wrap break-words">{project.description || 'No description provided.'}</p>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Posted Date</h4>
            <p className="font-medium">{formatDate(project.created_at)}</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Start Date</h4>
            <p className="font-medium">{formatDate(project.start_date)}</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Role</h4>
            <p className="font-medium">{formatRole(project.role)}</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Budget</h4>
            <p className="font-medium">{formatBudget(project.budget)}</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Duration</h4>
            <p className="font-medium">{formatDuration(project.duration)}</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Location</h4>
            <p className="font-medium">{formatLocation(project.location)}</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-sm text-muted-foreground">Work Type</h4>
            <p className="font-medium">{formatWorkType(project.work_type)}</p>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border rounded-md p-3 bg-muted/20">
            <h4 className="text-sm font-medium">Insurance Required</h4>
            <p className="text-sm mt-1 font-medium">
              {project.requires_insurance ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="border rounded-md p-3 bg-muted/20">
            <h4 className="text-sm font-medium">Equipment Required</h4>
            <p className="text-sm mt-1 font-medium">
              {project.requires_equipment ? 'Yes' : 'No'}
            </p>
          </div>
          <div className="border rounded-md p-3 bg-muted/20">
            <h4 className="text-sm font-medium">Site Visits Required</h4>
            <p className="text-sm mt-1 font-medium">
              {project.requires_site_visits ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
