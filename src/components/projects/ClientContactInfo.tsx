
import React from 'react';
import { Mail, Phone, Building, User, ExternalLink, MapPin, Globe, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useContactInfo } from '@/hooks/leads/useContactInfo';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface ClientContactInfoProps {
  projectId: string;
}

const ClientContactInfo: React.FC<ClientContactInfoProps> = ({ projectId }) => {
  const { clientInfo, isLoading, error } = useContactInfo(projectId);
  const navigate = useNavigate();
  
  console.log('ClientContactInfo rendering with:', { clientInfo, isLoading, error });

  const handleMessageNow = () => {
    navigate(`/dashboard/freelancer?tab=messages&projectId=${projectId}&clientId=${clientInfo?.user_id || ''}`);
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-green-800 font-medium flex items-center gap-2">
            <User className="h-4 w-4" />
            Client Contact Information
          </h3>
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-100 shadow-sm">
        <CardContent className="p-4">
          <p className="text-red-800">Error loading client information: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!clientInfo) {
    return (
      <Card className="bg-yellow-50 border-yellow-100 shadow-sm">
        <CardContent className="p-4">
          <p className="text-yellow-800">Client information is not available.</p>
        </CardContent>
      </Card>
    );
  }

  const hasEssentialContactInfo = !!(clientInfo.contact_name || clientInfo.email || clientInfo.phone_number);

  const formatPhoneForLink = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    
    if (phone.startsWith('+')) {
      return phone;
    }
    
    if (digits.startsWith('00')) {
      return '+' + digits.substring(2);
    }
    
    return digits;
  };

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 shadow-sm">
      <CardContent className="p-4 space-y-4">
        <h3 className="text-green-800 font-semibold flex items-center gap-2 pb-2 border-b border-green-100">
          <User className="h-5 w-5 text-green-700" />
          Client Contact Information
        </h3>
        
        {!hasEssentialContactInfo ? (
          <div className="text-yellow-700 p-2 bg-yellow-50 border border-yellow-100 rounded">
            <p>No contact information available for this client.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clientInfo.contact_name && (
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                  <User className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <span className="text-sm text-gray-500">Contact Name</span>
                  <p className="font-medium text-gray-900">{clientInfo.contact_name}</p>
                </div>
              </div>
            )}
            
            {clientInfo.email && (
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                  <Mail className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="font-medium">
                    <a href={`mailto:${clientInfo.email}`} className="text-blue-600 hover:underline">
                      {clientInfo.email}
                    </a>
                  </p>
                </div>
              </div>
            )}
            
            {clientInfo.phone_number && (
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                  <Phone className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <span className="text-sm text-gray-500">Phone</span>
                  <p className="font-medium">
                    <a 
                      href={`tel:${formatPhoneForLink(clientInfo.phone_number)}`} 
                      className="text-blue-600 hover:underline"
                    >
                      {clientInfo.phone_number}
                    </a>
                  </p>
                </div>
              </div>
            )}
            
            {clientInfo.company_name && (
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                  <Building className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <span className="text-sm text-gray-500">Company</span>
                  <p className="font-medium text-gray-900">{clientInfo.company_name}</p>
                </div>
              </div>
            )}
            
            {clientInfo.website && (
              <div className="flex items-center gap-3">
                <div className="bg-white p-1.5 rounded-full shadow-sm">
                  <Globe className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <span className="text-sm text-gray-500">Website</span>
                  <p className="font-medium">
                    <a href={clientInfo.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-[200px] inline-block">
                      {clientInfo.website}
                    </a>
                  </p>
                </div>
              </div>
            )}
            
            {clientInfo.company_address && (
              <div className="flex items-start gap-3">
                <div className="bg-white p-1.5 rounded-full shadow-sm mt-0.5">
                  <MapPin className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <span className="text-sm text-gray-500">Address</span>
                  <p className="font-medium text-gray-900">{clientInfo.company_address}</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Action tips card */}
        <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Next Steps</h4>
              <ul className="text-sm text-blue-700 space-y-1.5">
                <li className="flex items-start gap-1.5">
                  <Clock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>Reach out promptly to discuss requirements</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>Fully understand project scope and timeline</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  <span>Provide a detailed quote to increase chances</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex items-center pt-2 gap-2">
          {clientInfo.website && (
            <Button
              variant="outline"
              size="sm"
              className="border-green-200 hover:bg-green-100 text-green-700"
              onClick={() => window.open(clientInfo.website!, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Website
            </Button>
          )}
          
          <Button
            variant="default"
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white ml-auto"
            onClick={handleMessageNow}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Message Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientContactInfo;
