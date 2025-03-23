
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientProfileData } from '@/pages/client/types';
import { Users, Home, Briefcase } from 'lucide-react';

interface ClientDetailsSectionProps {
  clientProfile: ClientProfileData;
}

const ClientDetailsSection: React.FC<ClientDetailsSectionProps> = ({ clientProfile }) => {
  // Don't show the section if none of these fields are present
  if (!clientProfile.company_type && !clientProfile.employee_size && !clientProfile.company_specialism && !clientProfile.company_turnover) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          Company Details
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {clientProfile.company_type && (
          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Company Type</p>
              <p className="font-medium">{clientProfile.company_type}</p>
            </div>
          </div>
        )}
        
        {clientProfile.employee_size && (
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Company Size</p>
              <p className="font-medium">{clientProfile.employee_size} employees</p>
            </div>
          </div>
        )}
        
        {clientProfile.company_specialism && (
          <div className="flex items-start gap-3">
            <Home className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Specialism</p>
              <p className="font-medium">{clientProfile.company_specialism}</p>
            </div>
          </div>
        )}
        
        {clientProfile.company_turnover && (
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 flex items-center justify-center text-gray-600 mt-0.5">£</div>
            <div>
              <p className="text-sm font-medium text-gray-500">Annual Turnover</p>
              <p className="font-medium">{clientProfile.company_turnover}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientDetailsSection;
