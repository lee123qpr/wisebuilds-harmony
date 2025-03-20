
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Coins, MapPin, Briefcase, ArrowRight, Quote, MessageSquare, User } from 'lucide-react';
import { format } from 'date-fns';
import HiringStatusBadge from '@/components/projects/HiringStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import QuoteDialog from '@/components/quotes/QuoteDialog';
import { useFreelancerQuote } from '@/hooks/quotes/useFreelancerQuote';
import ViewQuoteDetails from '@/components/quotes/ViewQuoteDetails';
import { createConversation } from '@/services/conversations';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import QuoteStatusBadge from '@/components/quotes/table/QuoteStatusBadge';
import { useContactInfo } from '@/hooks/leads/useContactInfo';

interface PurchasedProjectProps {
  project: any;
}

const PurchasedProjectCard: React.FC<PurchasedProjectProps> = ({ project }) => {
  const navigate = useNavigate();
  const [showQuoteDetails, setShowQuoteDetails] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { clientInfo, isLoading: isLoadingClientInfo } = useContactInfo(project.id);
  
  // Check if the freelancer has already submitted a quote
  const { data: existingQuote, isLoading: isCheckingQuote } = useFreelancerQuote({
    projectId: project.id
  });
  
  const hasSubmittedQuote = !!existingQuote;
  const quoteStatus = project.quote_status || existingQuote?.status;
  
  const handleViewDetails = () => {
    navigate(`/marketplace/${project.id}`);
  };
  
  const handleRefresh = () => {
    setShowQuoteDetails(true);
  };
  
  const handleStartChat = async () => {
    try {
      if (!user) {
        throw new Error('Not authenticated');
      }
      
      console.log('Starting chat between freelancer', user.id, 'and client', project.user_id, 'for project', project.id);
      
      // Check if conversation already exists
      const { data: existingConversations, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('project_id', project.id)
        .eq('freelancer_id', user.id)
        .eq('client_id', project.user_id);
        
      if (checkError) throw checkError;
      
      if (existingConversations && existingConversations.length > 0) {
        console.log('Using existing conversation:', existingConversations[0].id);
        navigate(`/dashboard/freelancer?tab=messages&conversation=${existingConversations[0].id}`);
      } else {
        // Create a new conversation
        const newConversation = await createConversation(user.id, project.user_id, project.id);
        
        if (!newConversation) {
          throw new Error('Failed to create conversation');
        }
        
        console.log('Created new conversation:', newConversation.id);
        navigate(`/dashboard/freelancer?tab=messages&conversation=${newConversation.id}`);
      }
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast({
        title: 'Error starting chat',
        description: error.message || 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };
  
  const formattedDate = project.created_at 
    ? format(new Date(project.created_at), 'MMM d, yyyy')
    : 'Unknown date';
  
  // Display client name if available
  const clientName = clientInfo?.contact_name || 'Client';
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <CardTitle className="text-xl">{project.title}</CardTitle>
          <div className="flex items-center gap-2">
            {quoteStatus && <QuoteStatusBadge status={quoteStatus} />}
            <HiringStatusBadge status={project.hiring_status} />
          </div>
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
            
            {/* Client information */}
            {!isLoadingClientInfo && (
              <div className="flex items-center gap-1 text-sm text-blue-600">
                <User className="h-4 w-4" />
                <span>Client: <span className="font-semibold">{clientName}</span></span>
              </div>
            )}
            
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
              
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2"
                onClick={handleStartChat}
              >
                <MessageSquare className="h-4 w-4" />
                Message Now
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
              
              {quoteStatus === 'accepted' && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => navigate('/dashboard/freelancer?tab=activeJobs')}
                >
                  View Active Job
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchasedProjectCard;
