
import React from 'react';
import { ClientProfileData } from '@/pages/client/types';
import { Building } from 'lucide-react';

interface ClientHeaderSectionProps {
  clientProfile: ClientProfileData;
}

const ClientHeaderSection: React.FC<ClientHeaderSectionProps> = ({ clientProfile }) => {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-4">
        {clientProfile.logo_url ? (
          <img 
            src={clientProfile.logo_url} 
            alt={clientProfile.company_name || 'Company logo'} 
            className="h-20 w-20 rounded-md object-cover border"
          />
        ) : (
          <div className="h-20 w-20 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 border">
            <Building className="h-10 w-10" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">
            {clientProfile.company_name || clientProfile.contact_name || 'Client Profile'}
          </h1>
          {clientProfile.company_name && clientProfile.contact_name && (
            <p className="text-gray-600 mt-1">Contact: {clientProfile.contact_name}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientHeaderSection;
