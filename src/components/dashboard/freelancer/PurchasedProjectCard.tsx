
import React from 'react';
import { CalendarIcon, MapPinIcon, Clock, Briefcase, Eye, MessageSquare, Quote, User, DollarSign, Calendar } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface Project {
  id: string;
  title: string;
  budget: string;
  location: string;
  work_type: string;
  duration: string;
  role: string;
  created_at: string;
  application_created_at: string;
  start_date?: string;
  client_name?: string;
  client_company?: string;
}

interface PurchasedProjectCardProps {
  project: Project;
}

const PurchasedProjectCard: React.FC<PurchasedProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  
  // Format the timeAgo string
  const timeAgo = formatDistanceToNow(new Date(project.application_created_at), { addSuffix: true });
  
  // Format dates
  const createdDate = format(new Date(project.created_at), 'dd MMM yyyy');
  const startDate = project.start_date ? format(new Date(project.start_date), 'dd MMM yyyy') : 'Flexible';
  
  // Map budget to a readable format
  const budgetMap: Record<string, string> = {
    'less_than_1000': '< $1,000',
    '1000_to_5000': '$1,000 - $5,000',
    '5000_to_10000': '$5,000 - $10,000',
    '10000_to_25000': '$10,000 - $25,000',
    '25000_to_50000': '$25,000 - $50,000',
    'more_than_50000': '> $50,000',
  };

  const handleViewDetails = () => {
    navigate(`/marketplace/${project.id}`);
  };

  const handleMessage = () => {
    // Future implementation: Open message dialog or navigate to messages
    console.log('Message client for project:', project.id);
  };

  const handleQuote = () => {
    // Future implementation: Open quote dialog
    console.log('Create quote for project:', project.id);
  };
  
  return (
    <Card className="mb-4 hover:shadow-md transition-all border-l-4 border-l-primary">
      <div className="p-5">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-grow space-y-4">
            <div>
              <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Purchased {timeAgo}
                </Badge>
                
                <div className="text-sm font-medium text-muted-foreground">
                  {budgetMap[project.budget] || project.budget}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold tracking-tight mb-2">{project.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-2 text-primary/70" />
                  <span className="capitalize">{project.role.replace(/_/g, ' ')}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <MapPinIcon className="h-4 w-4 mr-2 text-primary/70" />
                  <span>{project.location}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-primary/70" />
                  <span className="capitalize">{project.duration.replace(/_/g, ' ')}</span>
                </div>
                
                <div className="flex items-center text-muted-foreground">
                  <DollarSign className="h-4 w-4 mr-2 text-primary/70" />
                  <span>{budgetMap[project.budget] || project.budget}</span>
                </div>
              </div>
            </div>
            
            {(project.client_name || project.client_company) && (
              <div className="bg-slate-50 rounded-md p-3 mt-3">
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 mr-2 text-primary/70" />
                  <span className="font-medium">Client Information</span>
                </div>
                <div className="pl-6 text-sm">
                  {project.client_name && <div>Name: {project.client_name}</div>}
                  {project.client_company && <div>Company: {project.client_company}</div>}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-row md:flex-col justify-end items-center gap-2 md:min-w-36">
            <Button 
              variant="default" 
              size="sm" 
              className="w-full justify-start gap-2"
              onClick={handleViewDetails}
            >
              <Eye className="h-4 w-4" />
              <span className="hidden md:inline">View Details</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start gap-2"
              onClick={handleMessage}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden md:inline">Message</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start gap-2"
              onClick={handleQuote}
            >
              <Quote className="h-4 w-4" />
              <span className="hidden md:inline">Create Quote</span>
            </Button>
          </div>
        </div>
        
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs text-muted-foreground">
          <div className="flex gap-3">
            <span className="flex items-center">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              Posted: {createdDate}
            </span>
            <span className="flex items-center">
              <Calendar className="mr-1 h-3.5 w-3.5" />
              Start: {startDate}
            </span>
          </div>
          <div className="flex gap-2 mt-2 md:mt-0">
            <Badge variant="outline" className="bg-slate-50">
              {project.work_type.replace(/_/g, ' ')}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PurchasedProjectCard;
