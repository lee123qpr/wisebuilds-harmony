
import React from 'react';
import { Table, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ProjectFilters from './ProjectFilters';
import ProjectTableBody from './ProjectTableBody';
import { useProjects } from './useProjects';

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

  return (
    <div className="space-y-4">
      <ProjectFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        hiringFilter={hiringFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onHiringChange={setHiringFilter}
      />

      <Table>
        <TableCaption>A list of your posted projects</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Posted Date</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Hiring Status</TableHead>
            <TableHead>Applications</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <ProjectTableBody 
          projects={projects} 
          isLoading={isLoading} 
          refreshProjects={refreshProjects}
        />
      </Table>
    </div>
  );
};

export default ProjectsTable;
