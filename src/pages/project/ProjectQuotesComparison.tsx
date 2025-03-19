
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import MainLayout from '@/components/layout/MainLayout';
import QuoteCard from '@/components/quotes/QuoteCard';
import ProjectQuotesComparisonTable from '@/components/quotes/ProjectQuotesComparisonTable';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ProjectQuotesComparison = () => {
  const { projectId } = useParams();
  const { toast: legacyToast } = useToast();
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  const { project, loading: projectLoading } = useProjectDetails(projectId);
  const { user } = useAuth();
  const [directQuotesCount, setDirectQuotesCount] = useState<number | null>(null);
  const [isCheckingDirectly, setIsCheckingDirectly] = useState(false);
  
  console.log("ProjectQuotesComparison - Current projectId from URL params:", projectId);
  console.log("ProjectQuotesComparison - Current user:", user?.id);
  
  const { 
    data: quotes, 
    isLoading: quotesLoading, 
    refetch, 
    isRefetching,
    isError,
    error
  } = useQuotes({ 
    projectId: projectId,
    forClient: true,
    refreshInterval: 10000 // Refresh every 10 seconds
  });

  const isLoading = projectLoading || quotesLoading;

  // Force refetch when the component mounts or manual refresh happens
  useEffect(() => {
    console.log('ProjectQuotesComparison component mounted or manual refresh triggered, fetching latest quotes');
    refetch();
  }, [refetch, manualRefreshCount]);

  // Show toast when new quotes arrive (if not initial load)
  useEffect(() => {
    if (quotes) {
      console.log('Quotes data available in component:', quotes.length, 'quotes', quotes);
    }
  }, [quotes]);

  const handleManualRefresh = () => {
    toast.info('Refreshing quotes...');
    console.log('Manual refresh triggered');
    setManualRefreshCount(prev => prev + 1);
  };

  // Function to check directly in the database
  const checkQuotesDirectly = async () => {
    if (!projectId || !user) return;
    
    setIsCheckingDirectly(true);
    try {
      console.log('Checking quotes directly in the database for project:', projectId);
      
      // Check all quotes for this project regardless of client_id
      const { data: allQuotes, error: allQuotesError } = await supabase
        .from('quotes')
        .select('id, project_id, client_id, freelancer_id, status')
        .eq('project_id', projectId);
      
      if (allQuotesError) {
        console.error('Error checking quotes directly:', allQuotesError);
        toast.error('Error checking quotes directly');
        return;
      }
      
      console.log('Direct database check results:', allQuotes);
      setDirectQuotesCount(allQuotes?.length || 0);
      
      if (allQuotes && allQuotes.length > 0) {
        const clientIds = [...new Set(allQuotes.map(q => q.client_id))];
        console.log('Quote client IDs in database:', clientIds);
        console.log('Current user ID:', user.id);
        console.log('Quotes that match current user:', allQuotes.filter(q => q.client_id === user.id).length);
      }
    } catch (err) {
      console.error('Error in direct check:', err);
    } finally {
      setIsCheckingDirectly(false);
    }
  };

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

  if (isError) {
    console.error("Error fetching quotes:", error);
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
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load quotes. Please try refreshing the page.
              {error instanceof Error ? ` Error: ${error.message}` : ''}
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={handleManualRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
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
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleManualRefresh}
            disabled={isRefetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            Refresh Quotes
          </Button>
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
              <p className="text-muted-foreground mb-4">
                When freelancers submit quotes for your project, they will appear here for comparison.
              </p>
              
              <Alert className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Diagnostic Information</AlertTitle>
                <AlertDescription>
                  <div className="space-y-2 mt-2">
                    <p><strong>Project ID:</strong> {projectId}</p>
                    <p><strong>User ID:</strong> {user?.id}</p>
                    <p><strong>Quotes count:</strong> {quotes?.length || 0}</p>
                    {directQuotesCount !== null && (
                      <p><strong>Direct DB quotes count:</strong> {directQuotesCount}</p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="mb-4">
                <Button 
                  variant="secondary"
                  onClick={checkQuotesDirectly}
                  disabled={isCheckingDirectly}
                  className="w-full"
                >
                  {isCheckingDirectly ? 'Checking...' : 'Run Database Diagnostic Check'}
                </Button>
              </div>
              
              <Accordion type="single" collapsible className="mb-4">
                <AccordionItem value="troubleshooting">
                  <AccordionTrigger className="text-sm">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Troubleshooting Information
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>Common reasons for quotes not appearing:</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>No quotes have been submitted yet</li>
                        <li>Quotes were submitted to a different project ID</li>
                        <li>Quotes have a different client_id than your user ID</li>
                        <li>Database permissions prevent fetching the quotes</li>
                      </ul>
                      <p className="mt-2">Try using the diagnostic button above to check directly in the database.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant="default" onClick={handleManualRefresh} disabled={isRefetching}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                Refresh Quotes
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/project/${projectId}`}>Back to Project</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectQuotesComparison;
