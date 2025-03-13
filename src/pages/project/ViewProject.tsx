
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/projects/useProjects';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PenSquare, ArrowLeft, Trash2, FileText, Users } from 'lucide-react';
import { format } from 'date-fns';
import ProjectStatusBadge from '@/components/projects/ProjectStatusBadge';
import HiringStatusBadge from '@/components/projects/HiringStatusBadge';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const ViewProject = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) return;
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        // Parse documents field if it exists
        const projectWithDocuments = {
          ...data,
          documents: Array.isArray(data.documents) 
            ? data.documents 
            : (data.documents ? JSON.parse(String(data.documents)) : [])
        } as Project;
        
        setProject(projectWithDocuments);
      } catch (error: any) {
        console.error('Error fetching project:', error);
        toast({
          variant: 'destructive',
          title: 'Error fetching project',
          description: error.message || 'Failed to fetch project details'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId]);

  const handleDelete = async () => {
    try {
      if (!projectId) return;

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      });

      navigate('/dashboard/business');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        variant: 'destructive',
        title: "Error deleting project",
        description: error.message || "There was an error deleting the project.",
      });
    }
  };

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

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/business')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Loading project...</h1>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center gap-2 mb-6">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/business')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Project not found</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">The project you're looking for doesn't exist or you don't have permission to view it.</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate('/dashboard/business')}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard/business')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold truncate max-w-md">{project.title}</h1>
          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/project/${project.id}/edit`)}
            >
              <PenSquare className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
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
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Project Status</h4>
                  <div>
                    <ProjectStatusBadge status={project.status} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Hiring Status</h4>
                  <div>
                    <HiringStatusBadge status={project.hiring_status} />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Applications</h4>
                  <p className="font-medium">{project.applications || 0} applications</p>
                </div>
              </CardContent>
              {project.applications > 0 && (
                <CardFooter className="pt-2">
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => navigate(`/project/${project.id}/applications`)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Applications
                  </Button>
                </CardFooter>
              )}
            </Card>

            {project.documents && project.documents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Files attached to this project</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {project.documents.map((doc, index) => (
                      <li key={index}>
                        <a 
                          href={doc.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 border rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium truncate">{doc.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/project/${project.id}/documents`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Manage Documents
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ViewProject;
