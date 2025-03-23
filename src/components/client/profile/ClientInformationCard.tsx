
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Clock, Mail, MapPin, Phone, User, Globe } from 'lucide-react';
import { ClientProfileData } from '@/pages/client/types';

interface ClientInformationCardProps {
  clientProfile: ClientProfileData;
  formatDate: (dateString: string | null) => string;
}

const ClientInformationCard: React.FC<ClientInformationCardProps> = ({ clientProfile, formatDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          Client Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {clientProfile.contact_name && (
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Contact Name</p>
              <p className="font-medium">{clientProfile.contact_name}</p>
            </div>
          </div>
        )}
        
        {clientProfile.company_name && (
          <div className="flex items-start gap-3">
            <Building className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Company</p>
              <p className="font-medium">{clientProfile.company_name}</p>
            </div>
          </div>
        )}
        
        {clientProfile.email && (
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <a href={`mailto:${clientProfile.email}`} className="font-medium text-blue-600 hover:underline">
                {clientProfile.email}
              </a>
            </div>
          </div>
        )}
        
        {clientProfile.phone_number && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <a href={`tel:${clientProfile.phone_number}`} className="font-medium text-blue-600 hover:underline">
                {clientProfile.phone_number}
              </a>
            </div>
          </div>
        )}
        
        {clientProfile.website && (
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Website</p>
              <a href={clientProfile.website.startsWith('http') ? clientProfile.website : `https://${clientProfile.website}`} 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="font-medium text-blue-600 hover:underline">
                {clientProfile.website}
              </a>
            </div>
          </div>
        )}
        
        {clientProfile.company_address && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="font-medium">{clientProfile.company_address}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-500">Member Since</p>
            <p className="font-medium">{formatDate(clientProfile.member_since)}</p>
          </div>
        </div>
        
        {clientProfile.jobs_completed && clientProfile.jobs_completed > 0 && (
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 flex items-center justify-center text-gray-600 mt-0.5">✓</div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed Jobs</p>
              <p className="font-medium">{clientProfile.jobs_completed}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientInformationCard;
