
import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building, Check, Mail, Briefcase, User } from 'lucide-react';
import { format } from 'date-fns';
import { ClientProfileData } from '@/pages/client/types';
import RatingStars from '@/components/common/RatingStars';
import { useClientReviews } from '@/pages/dashboard/hooks/useClientReviews';

interface ClientProfileCardProps {
  clientProfile: ClientProfileData;
  formatDate: (dateString: string | null) => string;
}

const ClientProfileCard: React.FC<ClientProfileCardProps> = ({
  clientProfile,
  formatDate
}) => {
  // Get reviews and ratings
  const { averageRating, reviewCount } = useClientReviews(clientProfile.id);
  const [jobsCount, setJobsCount] = useState<number>(0);

  // Get initials for avatar fallback
  const getInitials = () => {
    const name = clientProfile.company_name || clientProfile.contact_name || 'Client';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Use useEffect to log and set the jobs completed count
  useEffect(() => {
    console.log('Raw jobs_completed value:', clientProfile.jobs_completed);
    let count = 0;
    
    if (clientProfile.jobs_completed !== null && clientProfile.jobs_completed !== undefined) {
      // Convert to number if it's a string
      count = typeof clientProfile.jobs_completed === 'string' 
        ? parseInt(clientProfile.jobs_completed, 10) 
        : clientProfile.jobs_completed;
        
      // Ensure it's a valid number
      count = isNaN(count) ? 0 : count;
    }
    
    console.log('Processed jobs count:', count);
    setJobsCount(count);
  }, [clientProfile.jobs_completed]);

  // Determine if this is an individual client
  const isIndividual = clientProfile.is_individual;
  
  // Display name will depend on whether this is an individual or company
  const displayName = isIndividual 
    ? clientProfile.contact_name || 'Individual Client'
    : clientProfile.company_name || 'Company';

  return (
    <div className="border shadow-md rounded-lg p-6">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-primary/10">
            {clientProfile.logo_url ? (
              <AvatarImage src={clientProfile.logo_url} alt={displayName} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-blue-50 text-blue-600">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center md:gap-2">
            <h2 className="text-xl font-bold">
              {displayName}
            </h2>
            {averageRating !== null && averageRating > 0 && <RatingStars rating={averageRating} reviewCount={reviewCount} className="mt-1 md:mt-0" />}
          </div>
          
          {/* Client type badge - prominently displayed near the top */}
          <div className="mt-1 mb-2">
            {isIndividual ? (
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200 flex items-center gap-1 w-fit">
                <User className="h-3 w-3" />
                Individual Client
              </Badge>
            ) : (
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200 flex items-center gap-1 w-fit">
                <Building className="h-3 w-3" />
                Company Client
              </Badge>
            )}
          </div>
          
          {/* Show contact name for companies (for individuals, it's already the display name) */}
          {!isIndividual && clientProfile.contact_name && (
            <p className="text-muted-foreground">
              Contact: {clientProfile.contact_name}
            </p>
          )}
          
          <div className="mt-4">
            <div className="space-y-1.5">
              {clientProfile.email && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <a href={`mailto:${clientProfile.email}`} className="text-blue-600 hover:underline">
                    {clientProfile.email}
                  </a>
                </div>
              )}
              
              {clientProfile.company_address && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span>{clientProfile.company_address}</span>
                </div>
              )}

              {clientProfile.company_specialism && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span>Specialism: {clientProfile.company_specialism}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            {clientProfile.member_since && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Member since {format(new Date(clientProfile.member_since), 'MMM yyyy')}
              </Badge>
            )}
            
            <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
              <Check className="h-3 w-3" />
              {jobsCount} {jobsCount === 1 ? 'job' : 'jobs'} completed
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileCard;
