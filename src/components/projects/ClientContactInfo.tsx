
import React, { useState, useEffect } from 'react';
import { Mail, Phone, Building, User, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface ClientContactInfoProps {
  projectId: string;
}

interface ClientInfo {
  contact_name: string | null;
  company_name: string | null;
  phone_number: string | null;
  email: string | null;
  website: string | null;
}

const ClientContactInfo: React.FC<ClientContactInfoProps> = ({ projectId }) => {
  const [clientInfo, setClientInfo] = useState<ClientInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientInfo = async () => {
      setIsLoading(true);
      try {
        // First get the project to get the user_id
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .select('user_id')
          .eq('id', projectId)
          .single();
        
        if (projectError) throw projectError;
        
        // Then get the client profile using the user_id
        const { data: clientProfile, error: clientError } = await supabase
          .from('client_profiles')
          .select('contact_name, company_name, phone_number, website')
          .eq('id', project.user_id)
          .maybeSingle();
        
        if (clientError) throw clientError;
        
        // Get the user email via RPC function
        const { data: userData, error: userError } = await supabase
          .rpc('get_user_email', { user_id: project.user_id });
        
        if (userError) throw userError;
        
        // Combine the data
        setClientInfo({
          ...clientProfile,
          email: userData && userData.email ? userData.email : null
        });
      } catch (error) {
        console.error('Error fetching client info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientInfo();
  }, [projectId]);

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

  if (!clientInfo) {
    return (
      <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4">
        <p className="text-yellow-800">Client information is not available.</p>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-100 rounded-md p-4 space-y-3">
      <h3 className="text-green-800 font-medium flex items-center gap-2">
        <User className="h-4 w-4" />
        Client Contact Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clientInfo.contact_name && (
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-green-600" />
            <span className="font-medium">Contact:</span> {clientInfo.contact_name}
          </div>
        )}
        
        {clientInfo.company_name && (
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-green-600" />
            <span className="font-medium">Company:</span> {clientInfo.company_name}
          </div>
        )}
        
        {clientInfo.phone_number && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-green-600" />
            <span className="font-medium">Phone:</span>
            <a href={`tel:${clientInfo.phone_number}`} className="text-blue-600 hover:underline">
              {clientInfo.phone_number}
            </a>
          </div>
        )}
        
        {clientInfo.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-green-600" />
            <span className="font-medium">Email:</span>
            <a href={`mailto:${clientInfo.email}`} className="text-blue-600 hover:underline">
              {clientInfo.email}
            </a>
          </div>
        )}
      </div>
      
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
