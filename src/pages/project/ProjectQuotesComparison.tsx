
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import MainLayout from '@/components/layout/MainLayout';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Import refactored component views
import LoadingView from './components/quotes-comparison/LoadingView';
import ErrorView from './components/quotes-comparison/ErrorView';
import ProjectNotFoundView from './components/quotes-comparison/ProjectNotFoundView';
import NoQuotesView from './components/quotes-comparison/NoQuotesView';
import QuotesContent from './components/quotes-comparison/QuotesContent';
import QuotesHeader from './components/quotes-comparison/QuotesHeader';
import DiagnosticTools from './components/quotes-comparison/DiagnosticTools';

const ProjectQuotesComparison = () => {
  const { projectId } = useParams();
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  const { project, loading: projectLoading } = useProjectDetails(projectId);
  const { user } = useAuth();
  const [directQuotesCount, setDirectQuotesCount] = useState<number | null>(null);
  const [isCheckingDirectly, setIsCheckingDirectly] = useState(false);
  const [isFixingClientIDs, setIsFixingClientIDs] = useState(false);
  
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
    refreshInterval: 10000, // Refresh every 10 seconds
    includeAllQuotes: true  // Always show all quotes for the project
  });

  const isLoading = projectLoading || quotesLoading;

  useEffect(() => {
    console.log('ProjectQuotesComparison component mounted or manual refresh triggered, fetching latest quotes');
    refetch();
  }, [refetch, manualRefreshCount]);

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

  const checkQuotesDirectly = async () => {
    if (!projectId || !user) return;
    
    setIsCheckingDirectly(true);
    try {
      console.log('Checking quotes directly in the database for project:', projectId);
      
      const { data: allQuotes, error: allQuotesError } = await supabase
        .from('quotes')
        .select('id, project_id, client_id, freelancer_id, status, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      
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

  const fixClientIds = async () => {
    if (!projectId || !user) return;
    
    setIsFixingClientIDs(true);
    try {
      const { data: incorrectQuotes, error: checkError } = await supabase
        .from('quotes')
        .select('id, client_id')
        .eq('project_id', projectId)
        .neq('client_id', user.id);
      
      if (checkError) {
        console.error('Error checking for incorrect quotes:', checkError);
        toast.error('Error checking quotes');
        return;
      }
      
      if (!incorrectQuotes || incorrectQuotes.length === 0) {
        toast.info('No quotes need fixing', {
          description: 'All quotes for this project already have the correct client ID'
        });
        return;
      }
      
      console.log('Found quotes with incorrect client IDs:', incorrectQuotes);
      
      const { data: updateResult, error: updateError } = await supabase
        .from('quotes')
        .update({ client_id: user.id })
        .eq('project_id', projectId)
        .neq('client_id', user.id);
      
      if (updateError) {
        console.error('Error updating quotes:', updateError);
        toast.error('Error fixing quotes');
        return;
      }
      
      toast.success('Quotes fixed successfully', {
        description: `Updated ${incorrectQuotes.length} quotes to use your client ID`
      });
      
      refetch();
    } catch (err) {
      console.error('Error fixing client IDs:', err);
      toast.error('Error fixing quotes');
    } finally {
      setIsFixingClientIDs(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <MainLayout>
        <LoadingView projectId={projectId || ''} />
      </MainLayout>
    );
  }

  // Render error state
  if (isError) {
    console.error("Error fetching quotes:", error);
    return (
      <MainLayout>
        <ErrorView 
          projectId={projectId || ''} 
          error={error instanceof Error ? error : null} 
          onRefresh={handleManualRefresh} 
        />
      </MainLayout>
    );
  }

  // Render project not found state
  if (!project) {
    return (
      <MainLayout>
        <ProjectNotFoundView />
      </MainLayout>
    );
  }

  const hasQuotes = quotes && quotes.length > 0;
  
  console.log('Rendering quotes comparison with', quotes?.length || 0, 'quotes');

  return (
    <MainLayout>
      <div className="container py-8">
        <QuotesHeader 
          projectId={projectId || ''} 
          projectTitle={project?.title} 
          isRefetching={isRefetching} 
          onRefresh={handleManualRefresh} 
        />

        {hasQuotes ? (
          <QuotesContent quotes={quotes} />
        ) : (
          <NoQuotesView
            projectId={projectId || ''}
            userId={user?.id}
            directQuotesCount={directQuotesCount}
            isRefetching={isRefetching}
            onRefresh={handleManualRefresh}
          />
        )}

        {/* Only show diagnostic tools if there are no quotes */}
        {!hasQuotes && (
          <DiagnosticTools
            projectId={projectId}
            isCheckingDirectly={isCheckingDirectly}
            isFixingClientIDs={isFixingClientIDs}
            directQuotesCount={directQuotesCount}
            onCheckDirectly={checkQuotesDirectly}
            onFixClientIds={fixClientIds}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ProjectQuotesComparison;
