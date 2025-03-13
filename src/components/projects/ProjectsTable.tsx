
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, Eye, MessageSquare, FileText, Search, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

// Define the Project type for TypeScript
type Project = {
  id: string;
  title: string;
  created_at: string;
  role: string;
  budget: string;
  status: string;
  hiring_status: string;
  applications: number;
};

const ProjectsTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [hiringFilter, setHiringFilter] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setProjects(data || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load projects. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects'
        },
        (payload) => {
          console.log('Realtime change:', payload);
          // Refresh the projects list
          fetchProjects();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Filter the projects based on search query and filters
  const filteredProjects = projects.filter(project => {
    // Search filter
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    // Hiring status filter
    const matchesHiring = hiringFilter === 'all' || project.hiring_status === hiringFilter;
    
    return matchesSearch && matchesStatus && matchesHiring;
  });

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (error) {
      return dateString;
    }
  };

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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                Loading projects...
              </TableCell>
            </TableRow>
          ) : filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{formatDate(project.created_at)}</TableCell>
                <TableCell>{project.role}</TableCell>
                <TableCell>{project.budget}</TableCell>
                <TableCell>
                  {renderStatusBadge(project.status)}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      project.hiring_status === 'urgent' 
                        ? 'destructive' 
                        : project.hiring_status === 'ready' 
                          ? 'default' 
                          : 'outline'
                    }
                  >
                    {project.hiring_status === 'urgent' 
                      ? 'Urgent' 
                      : project.hiring_status === 'ready' 
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
