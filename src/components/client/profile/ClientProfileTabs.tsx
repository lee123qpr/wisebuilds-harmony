
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Star } from 'lucide-react';
import { ClientProfileData } from '@/pages/client/types';
import CompanyDescriptionCard from './CompanyDescriptionCard';
import ClientInformationCard from './ClientInformationCard';

interface ClientProfileTabsProps {
  clientProfile: ClientProfileData;
  formatDate: (dateString: string | null) => string;
}

const ClientProfileTabs: React.FC<ClientProfileTabsProps> = ({ 
  clientProfile,
  formatDate
}) => {
  return (
    <Tabs defaultValue="profile" className="space-y-4">
      <TabsList className="ml-1">
        <TabsTrigger value="profile">
          <Building className="h-4 w-4 mr-2" />
          Company Profile
        </TabsTrigger>
        {/* Could add more tabs like Reviews in the future */}
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
    </Tabs>
  );
};

export default ClientProfileTabs;
