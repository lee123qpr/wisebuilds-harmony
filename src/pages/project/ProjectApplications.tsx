
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import { useProjectApplications } from '@/hooks/useProjectApplications';
import FreelancerApplicationCard from '@/components/applications/FreelancerApplicationCard';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectApplications = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { project, loading: projectLoading } = useProjectDetails(projectId);
  const { applications, isLoading, error } = useProjectApplications(projectId);

  // Loading skeleton for application cards
  const ApplicationCardSkeleton = () => (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-4">
            <div>
              <Skeleton className="h-7 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-24 w-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-full max-w-md mb-1" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/project/${projectId}`)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Project Applications</h1>
        </div>

        {projectLoading ? (
          <Skeleton className="h-12 w-full max-w-md mb-6" />
        ) : (
          <div className="mb-6">
            <h2 className="text-xl font-semibold">{project?.title}</h2>
            <p className="text-muted-foreground">Review freelancers who have applied to this project</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
            <ApplicationCardSkeleton />
            <ApplicationCardSkeleton />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-red-500">Error loading applications: {error}</p>
            </CardContent>
          </Card>
        ) : applications.length === 0 ? (
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-16 w-16 text-muted-foreground mb-4 opacity-30" />
              <h3 className="text-xl font-medium mb-2">No applications yet</h3>
              <p className="text-muted-foreground max-w-md">
                No freelancers have applied to this project yet. Check back later or edit your project to make it more attractive.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => navigate(`/project/${projectId}`)}
              >
                Back to Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-6">
              <h3 className="text-blue-700 font-medium mb-1">
                Structural Engineers who want to work with you
              </h3>
              <p className="text-blue-600 text-sm">
                These matches can be contacted right away and are most likely to get your project done!
              </p>
            </div>

            {applications.map((application) => (
              <FreelancerApplicationCard
                key={application.id}
                application={application}
                projectId={projectId || ''}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectApplications;
