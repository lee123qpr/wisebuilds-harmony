
import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import ProjectActions from '@/components/projects/ProjectActions';
import { useProjects } from '@/components/projects/useProjects';
import ProjectFilters from '@/components/projects/ProjectFilters';
import { Input } from '@/components/ui/input';

const ProjectsTable = () => {
  const { 
    projects, 
    isLoading, 
    refreshProjects,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    hiringFilter,
    setHiringFilter
  } = useProjects();

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Filter projects based on search query and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    const matchesHiring = hiringFilter === 'all' || project.hiring_status === hiringFilter;
    
    return matchesSearch && matchesStatus && matchesHiring;
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between mb-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                <TableCell><Skeleton className="h-8 w-32" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <ProjectFilters 
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter}
            hiringFilter={hiringFilter}
            setHiringFilter={setHiringFilter}
          />
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No projects found. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    {project.title.startsWith('Test ') ? (
                      <span className="flex items-center">
                        {project.title}
                        <Badge variant="outline" className="ml-2 text-xs bg-yellow-50">Test</Badge>
                      </span>
                    ) : (
                      project.title
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status === 'active' ? 'Active' : 'Closed'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(project.created_at)}</TableCell>
                  <TableCell>{project.applications || 0}</TableCell>
                  <TableCell className="text-right">
                    <ProjectActions 
                      applications={project.applications || 0} 
                      projectId={project.id} 
                      hasDocuments={project.documents?.length > 0}
                      refreshProjects={refreshProjects}
                      projectTitle={project.title}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
