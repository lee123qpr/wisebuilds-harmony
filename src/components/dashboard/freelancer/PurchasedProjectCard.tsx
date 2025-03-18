
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Coins, MapPin, Briefcase, ArrowRight, Quote } from 'lucide-react';
import { format } from 'date-fns';
import HiringStatusBadge from '@/components/projects/HiringStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import { useFreelancerQuote } from '@/hooks/quotes/useFreelancerQuote';
import ViewQuoteDetails from '@/components/quotes/ViewQuoteDetails';

interface PurchasedProjectProps {
  project: any;
}

const PurchasedProjectCard: React.FC<PurchasedProjectProps> = ({ project }) => {
  const navigate = useNavigate();
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  
  // Check if the freelancer has already submitted a quote
  const { data: existingQuote, isLoading: isCheckingQuote } = useFreelancerQuote({
    projectId: project.id
  });
  
  const hasSubmittedQuote = !!existingQuote;
  
  const handleViewDetails = () => {
    navigate(`/marketplace/${project.id}`);
  };
  
  const handleRefresh = () => {
    setShowQuoteDetails(true);
  };
  
  const formattedDate = project.created_at 
    ? format(new Date(project.created_at), 'MMM d, yyyy')
    : 'Unknown date';
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <HiringStatusBadge status={project.hiring_status} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
              
              {project.budget && (
                <div className="flex items-center gap-1">
                  <Coins className="h-4 w-4" />
                  <span>{project.budget}</span>
                </div>
              )}
              
              {project.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                </div>
              )}
              
              {project.role && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{project.role}</span>
                </div>
              )}
            </div>
            
            {/* Display quote details when available and showQuoteDetails is true */}
            {showQuoteDetails && hasSubmittedQuote && (
              <ViewQuoteDetails 
                projectId={project.id} 
                projectTitle={project.title}
              />
            )}
            
            <div className="flex flex-wrap gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleViewDetails}
              >
                View Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              {hasSubmittedQuote ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2"
                  onClick={() => setShowQuoteDetails(!showQuoteDetails)}
                >
                  <Quote className="h-4 w-4" />
                  {showQuoteDetails ? 'Hide Quote' : 'View Quote'}
                </Button>
              ) : (
                <QuoteDialog 
                  projectId={project.id}
                  projectTitle={project.title}
                  clientId={project.user_id}
                  onQuoteSubmitted={handleRefresh}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchasedProjectCard;
