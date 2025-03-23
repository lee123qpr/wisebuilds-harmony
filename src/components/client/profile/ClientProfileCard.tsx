
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Building, Check, Globe } from 'lucide-react';
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

  return (
    <div className="border shadow-md rounded-lg p-6">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-primary/10">
            {clientProfile.logo_url ? (
              <AvatarImage src={clientProfile.logo_url} alt={clientProfile.company_name || 'Company'} className="object-cover" />
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
              {clientProfile.company_name || clientProfile.contact_name || 'Client'}
            </h2>
            {averageRating !== null && averageRating > 0 && <RatingStars rating={averageRating} reviewCount={reviewCount} className="mt-1 md:mt-0" />}
          </div>
          
          {clientProfile.contact_name && clientProfile.company_name && (
            <p className="text-muted-foreground">
              Contact: {clientProfile.contact_name}
            </p>
          )}
          
          <div className="mt-4">
            <div className="space-y-1.5">
              {clientProfile.member_since && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span>Member since {formatDate(clientProfile.member_since)}</span>
                </div>
              )}
              
              {clientProfile.jobs_completed && clientProfile.jobs_completed > 0 && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Check className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span>{clientProfile.jobs_completed} {clientProfile.jobs_completed === 1 ? 'job' : 'jobs'} completed</span>
                </div>
              )}
              
              {clientProfile.company_address && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <span>{clientProfile.company_address}</span>
                </div>
              )}

              {clientProfile.website && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Globe className="mr-1.5 h-4 w-4 flex-shrink-0" />
                  <a href={clientProfile.website.startsWith('http') ? clientProfile.website : `https://${clientProfile.website}`} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-blue-600 hover:underline">
                    {clientProfile.website}
                  </a>
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
            
            {clientProfile.jobs_completed && clientProfile.jobs_completed > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 flex items-center gap-1">
                <Check className="h-3 w-3" />
                {clientProfile.jobs_completed} {clientProfile.jobs_completed === 1 ? 'job' : 'jobs'} completed
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfileCard;
