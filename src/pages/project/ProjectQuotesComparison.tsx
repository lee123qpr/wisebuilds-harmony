import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useQuotes } from '@/hooks/quotes/useQuotes';
import { useProjectDetails } from '@/hooks/useProjectDetails';
import ProjectQuotesComparisonTable from '@/components/quotes/ProjectQuotesComparisonTable';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BackButton from '@/components/common/BackButton';
import LoadingView from './components/quotes-comparison/LoadingView';
import ErrorView from './components/quotes-comparison/ErrorView';
import NoQuotesView from './components/quotes-comparison/NoQuotesView';
import ProjectNotFoundView from './components/quotes-comparison/ProjectNotFoundView';
import DiagnosticTools from './components/quotes-comparison/DiagnosticTools';
import QuotesHeader from './components/quotes-comparison/QuotesHeader';
import QuotesContent from './components/quotes-comparison/QuotesContent';

const ProjectQuotesComparison = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we came from the business dashboard
  const fromBusinessDashboard = location.state?.from === 'businessDashboard';
  
  const handleGoBack = () => {
    if (fromBusinessDashboard) {
      // If we came from the business dashboard, go back there directly
      navigate('/dashboard/business');
    } else {
      // Otherwise go back to the project details page
      navigate(`/project/${projectId}`);
    }
  };
  
  const { data: quotes, isLoading: isLoadingQuotes, isError: isQuotesError } = useQuotes({
    projectId: projectId!,
    forClient: true
  });
  
  const { project, loading: isLoadingProject, error: projectError } = useProjectDetails(projectId);
  
  // Show loading state while data is being fetched
  if (isLoadingProject || isLoadingQuotes) {
    return (
      <MainLayout>
        <div className="container py-8">
          <BackButton onClick={handleGoBack} />
          <LoadingView />
        </div>
      </MainLayout>
    );
  }
  
  // Show error if project doesn't exist
  if (!project || projectError) {
    return (
      <MainLayout>
        <div className="container py-8">
          <BackButton onClick={handleGoBack} />
          <ProjectNotFoundView />
        </div>
      </MainLayout>
    );
  }
  
  // Show error if there was a problem loading quotes
  if (isQuotesError) {
    return (
      <MainLayout>
        <div className="container py-8">
          <BackButton onClick={handleGoBack} />
          <ErrorView projectId={projectId!} />
        </div>
      </MainLayout>
    );
  }
  
  // Define the content based on whether there are quotes
  const Content = () => {
    if (!quotes || quotes.length === 0) {
      return <NoQuotesView projectId={projectId!} projectTitle={project.title} />;
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Compare Quotes</CardTitle>
          <CardDescription>Quotes received for {project.title}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProjectQuotesComparisonTable 
            quotes={quotes} 
            projectId={projectId!}
          />
        </CardContent>
      </Card>
    );
  };
  
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <BackButton onClick={handleGoBack} />
        </div>
        <QuotesHeader project={project} quotesCount={quotes?.length || 0} />
        <Content />
      </div>
    </MainLayout>
  );
};

export default ProjectQuotesComparison;
