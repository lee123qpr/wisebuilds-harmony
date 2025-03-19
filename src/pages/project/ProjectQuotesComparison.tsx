
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import MainLayout from '@/components/layout/MainLayout';
import QuoteCard from '@/components/quotes/QuoteCard';
import ProjectQuotesComparisonTable from '@/components/quotes/ProjectQuotesComparisonTable';
import { useToast } from '@/hooks/use-toast';

const ProjectQuotesComparison = () => {
  const { projectId } = useParams();
  const { toast } = useToast();
  const { project, loading: projectLoading } = useProjectDetails(projectId);
  const { data: quotes, isLoading: quotesLoading, refetch } = useQuotes({ 
    projectId: projectId,
    forClient: true,
    refreshInterval: 10000 // Refresh every 10 seconds
  });

  const isLoading = projectLoading || quotesLoading;

  // Force refetch when the component mounts
  useEffect(() => {
    console.log('Quotes comparison page mounted, fetching latest quotes');
    refetch();
  }, [refetch]);

  // Show toast when new quotes arrive (if not initial load)
  useEffect(() => {
    if (quotes && quotes.length > 0 && !isLoading) {
      console.log('Quotes data available:', quotes.length, 'quotes', quotes);
    }
  }, [quotes, isLoading]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild>
              <Link to={`/project/${projectId}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Quotes Comparison</h1>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!project) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Project Not Found</h2>
            <p className="text-muted-foreground mt-2">The project you're looking for doesn't exist or you don't have access to it.</p>
            <Button className="mt-4" asChild>
              <Link to="/dashboard/business">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const hasQuotes = quotes && quotes.length > 0;
  
  console.log('Rendering quotes comparison with', quotes?.length || 0, 'quotes');

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" asChild>
            <Link to={`/project/${projectId}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Quotes Comparison</h1>
            <p className="text-muted-foreground">Project: {project.title}</p>
          </div>
        </div>

        {hasQuotes ? (
          <div className="space-y-8">
            <ProjectQuotesComparisonTable quotes={quotes} />
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Individual Quote Details</h2>
              <div className="space-y-6">
                {quotes.map((quote) => (
                  <QuoteCard key={quote.id} quote={quote} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No Quotes Yet</CardTitle>
              <CardDescription>
                You haven't received any quotes for this project yet.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                When freelancers submit quotes for your project, they will appear here for comparison.
              </p>
              <Button className="mt-4" asChild>
                <Link to={`/project/${projectId}`}>Back to Project</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectQuotesComparison;
