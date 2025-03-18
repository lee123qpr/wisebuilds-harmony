
import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useProjects } from '@/components/projects/useProjects';
import ProjectFilters from '@/components/projects/ProjectFilters';
import ProjectCardHorizontal from './ProjectCardHorizontal';

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
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full mb-4" />
        ))}
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
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <ProjectFilters 
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              hiringFilter={hiringFilter}
              onSearchChange={setSearchQuery}
              onStatusChange={setStatusFilter}
              onHiringChange={setHiringFilter}
            />
          </div>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No projects found. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <ProjectCardHorizontal key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsTable;
