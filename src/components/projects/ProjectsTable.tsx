
import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Eye, MessageSquare, FileText, Search, CheckCircle2, Clock, XCircle } from 'lucide-react';

// This would come from your database in a real implementation
const sampleProjects = [
  {
    id: '1',
    title: 'Commercial Building Renovation',
    createdAt: '2023-12-15',
    role: 'Quantity Surveyor',
    budget: '£5,000-£10,000',
    status: 'active',
    hiringStatus: 'urgent',
    applications: 3,
  },
  {
    id: '2',
    title: 'Residential Property Extension Design',
    createdAt: '2023-12-10',
    role: 'Architect',
    budget: '£2,500-£5,000',
    status: 'draft',
    hiringStatus: 'enquiring',
    applications: 0,
  },
  {
    id: '3',
    title: 'Infrastructure Project Planning',
    createdAt: '2023-12-05',
    role: 'Planner',
    budget: '£10,000+',
    status: 'active',
    hiringStatus: 'ready',
    applications: 5,
  },
  {
    id: '4',
    title: 'Office Refurbishment',
    createdAt: '2023-11-28',
    role: 'Interior Designer',
    budget: '£10,000+',
    status: 'in-progress',
    hiringStatus: 'ready',
    applications: 2,
  },
  {
    id: '5',
    title: 'Landscaping Design for Housing Development',
    createdAt: '2023-11-15',
    role: 'Landscape Architect',
    budget: '£1,000-£2,500',
    status: 'cancelled',
    hiringStatus: 'enquiring',
    applications: 1,
  },
];

const ProjectsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hiringFilter, setHiringFilter] = useState('all');

  // Filter the projects based on search query and filters
  const filteredProjects = sampleProjects.filter(project => {
    // Search filter
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    // Hiring status filter
    const matchesHiring = hiringFilter === 'all' || project.hiringStatus === hiringFilter;
    
    return matchesSearch && matchesStatus && matchesHiring;
  });

  // Function to render status badge with appropriate styling and icon
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="bg-[#F2FCE2] text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-[#FEF7CD] text-amber-700 border-amber-200 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            In Progress
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="outline" className="bg-[#F1F0FB] text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            Draft
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={hiringFilter} onValueChange={setHiringFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Hiring" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hiring</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
              <SelectItem value="ready">Ready to hire</SelectItem>
              <SelectItem value="enquiring">Enquiring</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

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
        <TableBody>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.createdAt}</TableCell>
                <TableCell>{project.role}</TableCell>
                <TableCell>{project.budget}</TableCell>
                <TableCell>
                  {renderStatusBadge(project.status)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      project.hiringStatus === 'urgent' 
                        ? 'destructive' 
                        : project.hiringStatus === 'ready' 
                          ? 'default' 
                          : 'outline'
                    }
                  >
                    {project.hiringStatus === 'urgent' 
                      ? 'Urgent' 
                      : project.hiringStatus === 'ready' 
                        ? 'Ready to hire' 
                        : 'Enquiring'}
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
                    <Button variant="ghost" size="icon" title="Documents">
                      <FileText className="h-4 w-4" />
                    </Button>
                    {project.applications > 0 && (
                      <Button variant="ghost" size="icon" title="Applications">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No projects found. Try adjusting your filters or create a new project.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProjectsTable;

