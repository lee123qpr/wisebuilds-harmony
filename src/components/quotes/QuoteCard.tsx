
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Check, Clock, DollarSign, Eye, X } from 'lucide-react';
import { QuoteWithFreelancer } from '@/types/quotes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface QuoteCardProps {
  quote: QuoteWithFreelancer;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote }) => {
  const navigate = useNavigate();
  
  // Format the created date
  const formattedDate = format(new Date(quote.created_at), 'MMM d, yyyy');
  
  // Get freelancer info
  const freelancer = quote.freelancer_profile || {};
  const freelancerName = freelancer.display_name || 
    (freelancer.first_name && freelancer.last_name 
      ? `${freelancer.first_name} ${freelancer.last_name}`
      : 'Freelancer');
  
  // Get quote price info
  const priceType = quote.fixed_price 
    ? 'Fixed Price' 
    : quote.estimated_price 
      ? 'Estimated Price' 
      : 'Day Rate';
  
  const priceValue = quote.fixed_price || quote.estimated_price || quote.day_rate || 'Not specified';
  
  const handleViewDetails = () => {
    navigate(`/project/${quote.project_id}/quotes/${quote.id}`);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={freelancer.profile_photo} alt={freelancerName} />
            <AvatarFallback>{freelancerName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{freelancerName}</h3>
            <p className="text-sm text-muted-foreground">{freelancer.job_title || 'Freelancer'}</p>
          </div>
        </div>
        <QuoteStatusBadge status={quote.status} />
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Submitted on {formattedDate}</span>
          </div>
          
          <div className="line-clamp-3 text-sm">
            {quote.description || 'No description provided.'}
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-2">
            {/* Price info */}
            <div className="border rounded-md p-3 flex flex-col">
              <span className="text-sm text-muted-foreground mb-1 flex items-center">
                <DollarSign className="h-3.5 w-3.5 mr-1" />
                {priceType}
              </span>
              <span className="font-medium">{priceValue}</span>
            </div>
            
            {/* Start date */}
            <div className="border rounded-md p-3 flex flex-col">
              <span className="text-sm text-muted-foreground mb-1 flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Start Date
              </span>
              <span className="font-medium">
                {quote.available_start_date 
                  ? format(new Date(quote.available_start_date), 'MMM d, yyyy')
                  : 'Not specified'}
              </span>
            </div>
            
            {/* Duration */}
            <div className="border rounded-md p-3 flex flex-col">
              <span className="text-sm text-muted-foreground mb-1 flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                Duration
              </span>
              <span className="font-medium">
                {quote.estimated_duration && quote.duration_unit
                  ? `${quote.estimated_duration} ${quote.duration_unit}`
                  : 'Not specified'}
              </span>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleViewDetails}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const QuoteStatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>
      );
    case 'accepted':
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <Check className="h-3 w-3" />
          Accepted
        </Badge>
      );
    case 'declined':
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
          <X className="h-3 w-3" />
          Declined
        </Badge>
      );
    default:
      return null;
  }
};

export default QuoteCard;
