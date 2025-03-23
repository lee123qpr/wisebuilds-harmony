
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Star } from 'lucide-react';
import { ClientProfileData } from '@/pages/client/types';
import CompanyDescriptionCard from './CompanyDescriptionCard';
import ClientInformationCard from './ClientInformationCard';
import { useClientReviews } from '@/pages/dashboard/hooks/useClientReviews';
import ReviewsList from '@/pages/dashboard/components/profile/ReviewsList';

interface ClientProfileTabsProps {
  clientProfile: ClientProfileData;
  formatDate: (dateString: string | null) => string;
}

const ClientProfileTabs: React.FC<ClientProfileTabsProps> = ({ 
  clientProfile,
  formatDate
}) => {
  // Add reviews data
  const { averageRating, reviewCount } = useClientReviews(clientProfile.id);

  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList className="ml-1">
        <TabsTrigger value="profile">
          <Building className="h-4 w-4 mr-2" />
          Company Profile
        </TabsTrigger>
        <TabsTrigger value="reviews">
          <Star className="h-4 w-4 mr-2" />
          Reviews {reviewCount > 0 && `(${reviewCount})`}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="m-0">
        <div className="space-y-6">
          {/* Company Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ClientInformationCard 
              clientProfile={clientProfile}
              formatDate={formatDate}
            />
            
            {clientProfile.company_description && (
              <CompanyDescriptionCard description={clientProfile.company_description} />
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="reviews" className="m-0">
        <div className="space-y-6">
          <ReviewsList userId={clientProfile.id} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ClientProfileTabs;
