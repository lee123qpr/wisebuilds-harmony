
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
  const [hasDuplicateIdProblem, setHasDuplicateIdProblem] = useState(false);
  
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
    
    // If we have a projectId, check for duplicate ID problems on initial load
    if (projectId && user) {
      checkForDuplicateIdProblems();
    }
  }, [refetch, manualRefreshCount, projectId, user]);

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

  // New function to check for duplicate ID problems
  const checkForDuplicateIdProblems = async () => {
    if (!projectId || !user) return;
    
    try {
      const { data: allQuotes, error: checkError } = await supabase
        .from('quotes')
        .select('id, client_id, freelancer_id')
        .eq('project_id', projectId);
      
      if (checkError) {
        console.error('Error checking for duplicate ID problems:', checkError);
        return;
      }
      
      const duplicateIdQuotes = allQuotes?.filter(q => q.client_id === q.freelancer_id) || [];
      setHasDuplicateIdProblem(duplicateIdQuotes.length > 0);
      
      if (duplicateIdQuotes.length > 0) {
        console.warn('Found quotes with duplicate client/freelancer IDs:', duplicateIdQuotes);
      }
    } catch (err) {
      console.error('Error checking for duplicate IDs:', err);
    }
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
        const freelancerIds = [...new Set(allQuotes.map(q => q.freelancer_id))];
        console.log('Quote client IDs in database:', clientIds);
        console.log('Quote freelancer IDs in database:', freelancerIds);
        console.log('Current user ID:', user.id);
        
        // Check for duplicate ID problems
        const duplicateIdQuotes = allQuotes.filter(q => q.client_id === q.freelancer_id);
        setHasDuplicateIdProblem(duplicateIdQuotes.length > 0);
        
        if (duplicateIdQuotes.length > 0) {
          console.warn('Found quotes with duplicate client/freelancer IDs:', duplicateIdQuotes);
          toast.warning(`Found ${duplicateIdQuotes.length} quotes with identical client/freelancer IDs`, {
            description: "This can cause quotes to not appear correctly"
          });
        }
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
      // First get the project data to find the owner
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('user_id')
        .eq('id', projectId)
        .single();
      
      if (projectError) {
        console.error('Error fetching project data:', projectError);
        toast.error('Error fetching project data');
        return;
      }
      
      const projectOwnerId = projectData.user_id;
      console.log('Project owner ID:', projectOwnerId);
      
      if (!projectOwnerId) {
        toast.error('Could not determine project owner');
        return;
      }
      
      // Fix duplicate ID problems (where client_id == freelancer_id)
      const { data: duplicateFixResults, error: duplicateFixError } = await supabase
        .from('quotes')
        .update({ client_id: projectOwnerId })
        .eq('project_id', projectId)
        .filter('client_id', 'eq', 'freelancer_id')
        .select();
      
      if (duplicateFixError) {
        console.error('Error fixing duplicate IDs:', duplicateFixError);
        toast.error('Error fixing duplicate IDs');
        return;
      }
      
      const duplicateFixCount = duplicateFixResults?.length || 0;
      
      // Now fix any quotes that don't have the correct client_id
      const { data: clientFixResults, error: clientFixError } = await supabase
        .from('quotes')
        .update({ client_id: projectOwnerId })
        .eq('project_id', projectId)
        .neq('client_id', projectOwnerId)
        .select();
      
      if (clientFixError) {
        console.error('Error fixing client IDs:', clientFixError);
        toast.error('Error fixing client IDs');
        return;
      }
      
      const clientFixCount = clientFixResults?.length || 0;
      const totalFixedCount = duplicateFixCount + clientFixCount;
      
      if (totalFixedCount > 0) {
        toast.success(`Fixed ${totalFixedCount} quotes`, {
          description: `Updated ${duplicateFixCount} duplicate IDs and ${clientFixCount} incorrect client IDs`,
        });
        // Set this to false as we've fixed the problem
        setHasDuplicateIdProblem(false);
      } else {
        toast.info('No quotes needed fixing');
      }
      
      // Refetch quotes to show the updated results
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

        {/* Always show diagnostic tools if we have a duplicate ID problem */}
        {(hasDuplicateIdProblem || !hasQuotes) && (
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
