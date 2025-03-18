
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { FreelancerProfile } from '@/types/applications';

interface FreelancerContactInfoProps {
  profile?: FreelancerProfile;
}

const FreelancerContactInfo: React.FC<FreelancerContactInfoProps> = ({ profile }) => {
  return (
    <div>
      <p className="font-medium mb-2">Contact information:</p>
      <div className="space-y-2">
        {profile?.email && (
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`mailto:${profile.email}`} className="text-sm text-blue-600 hover:underline">{profile.email}</a>
          </div>
        )}
        
        {profile?.phone_number && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`tel:${profile.phone_number}`} className="text-sm text-blue-600 hover:underline">{profile.phone_number}</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerContactInfo;
