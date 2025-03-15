
import React from 'react';
import { Mail, Phone, Building, User, ExternalLink, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useContactInfo } from '@/hooks/leads/useContactInfo';

interface ClientContactInfoProps {
  projectId: string;
}

const ClientContactInfo: React.FC<ClientContactInfoProps> = ({ projectId }) => {
  const { clientInfo, isLoading, error } = useContactInfo(projectId);

  if (isLoading) {
    return (
      <div className="bg-green-50 border border-green-100 rounded-md p-4 space-y-3">
        <h3 className="text-green-800 font-medium">Client Contact Information</h3>
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-2/3" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-md p-4">
        <p className="text-red-800">Error loading client information: {error.message}</p>
      </div>
    );
  }

  if (!clientInfo) {
    return (
      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
        <p className="text-yellow-800">Client information is not available.</p>
      </div>
    );
  }

  // Get data from user metadata if needed
  const metadata = clientInfo.user_metadata || {};
  const contactName = clientInfo.contact_name || metadata.full_name;
  const phoneNumber = clientInfo.phone_number || metadata.phone_number;
  
  // Determine if we have at least the essential contact info
  const hasEssentialContactInfo = !!(contactName || clientInfo.email || phoneNumber);

  return (
    <div className="bg-green-50 border border-green-100 rounded-md p-4 space-y-4">
      <h3 className="text-green-800 font-medium flex items-center gap-2 pb-1 border-b border-green-100">
        <User className="h-4 w-4" />
        Client Contact Information
      </h3>
      
      {!hasEssentialContactInfo ? (
        <div className="text-yellow-700 p-2 bg-yellow-50 border border-yellow-100 rounded">
          <p>No contact information available for this client.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contactName && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="font-medium min-w-24">Contact Name:</span> 
              <span className="font-semibold">{contactName}</span>
            </div>
          )}
          
          {clientInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="font-medium min-w-24">Email:</span>
              <a href={`mailto:${clientInfo.email}`} className="text-blue-600 hover:underline">
                {clientInfo.email}
              </a>
            </div>
          )}
          
          {phoneNumber && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="font-medium min-w-24">Phone:</span>
              <a href={`tel:${phoneNumber}`} className="text-blue-600 hover:underline font-semibold">
                {phoneNumber}
              </a>
            </div>
          )}
          
          {clientInfo.company_name && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-green-600 flex-shrink-0" />
              <span className="font-medium min-w-24">Company:</span> {clientInfo.company_name}
            </div>
          )}
          
          {clientInfo.company_address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-green-600 flex-shrink-0 mt-1" />
              <span className="font-medium min-w-24">Address:</span> {clientInfo.company_address}
            </div>
          )}
        </div>
      )}
      
      {clientInfo.website && (
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="text-green-700 border-green-200 hover:bg-green-100"
            onClick={() => window.open(clientInfo.website!, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Website
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientContactInfo;
