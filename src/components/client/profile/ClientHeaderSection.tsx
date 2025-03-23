import React from 'react';
import { ClientProfileData } from '@/pages/client/types';
import { Building } from 'lucide-react';

interface ClientHeaderSectionProps {
  clientProfile: ClientProfileData;
}

// This component is now deprecated in favor of ClientProfileCard
// Keeping it for backward compatibility
const ClientHeaderSection: React.FC<ClientHeaderSectionProps> = ({ clientProfile }) => {
  return (
    <div className="mt-6 border-b pb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {clientProfile.logo_url ? (
          <img 
            src={clientProfile.logo_url} 
            alt={clientProfile.company_name || 'Company logo'} 
            className="h-24 w-24 rounded-lg object-cover border shadow-sm transition-transform hover:scale-105 duration-300"
          />
        ) : (
          <div className="h-24 w-24 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border shadow-sm">
            <Building className="h-12 w-12" />
          </div>
        )}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            {clientProfile.company_name || clientProfile.contact_name || 'Client Profile'}
          </h1>
          {clientProfile.company_name && clientProfile.contact_name && (
            <p className="text-slate-600 mt-2 text-lg">
              Contact: <span className="font-medium">{clientProfile.contact_name}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientHeaderSection;
