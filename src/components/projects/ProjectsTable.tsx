
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, MessageSquare } from 'lucide-react';

// This would come from your database in a real implementation
const sampleProjects = [
  {
    id: '1',
    title: 'Bathroom Renovation',
    createdAt: '2023-12-15',
    budget: '£4,500',
    status: 'active',
    applications: 3,
  },
  {
    id: '2',
    title: 'Kitchen Extension',
    createdAt: '2023-12-10',
    budget: '£12,000',
    status: 'draft',
    applications: 0,
  },
  {
    id: '3',
    title: 'Loft Conversion',
    createdAt: '2023-12-05',
    budget: '£25,000',
    status: 'active',
    applications: 5,
  },
];

const ProjectsTable = () => {
  return (
    <Table>
      <TableCaption>A list of your posted projects</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Posted Date</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applications</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sampleProjects.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell>{project.createdAt}</TableCell>
            <TableCell>{project.budget}</TableCell>
            <TableCell>
              <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                {project.status === 'active' ? 'Active' : 'Draft'}
              </Badge>
            </TableCell>
            <TableCell>{project.applications}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" title="View">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Edit">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
                {project.applications > 0 && (
                  <Button variant="ghost" size="icon" title="Applications">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ProjectsTable;
