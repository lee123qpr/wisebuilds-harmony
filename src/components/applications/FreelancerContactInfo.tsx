
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { FreelancerProfile } from '@/types/applications';

interface FreelancerContactInfoProps {
  profile?: FreelancerProfile;
}

const FreelancerContactInfo: React.FC<FreelancerContactInfoProps> = ({ profile }) => {
  if (!profile?.email && !profile?.phone_number) {
    return null;
  }

  return (
    <div className="bg-white p-4 rounded-md border border-slate-200 shadow-sm">
      <p className="font-medium mb-3 text-slate-700">Contact information</p>
      <div className="space-y-3">
        {profile?.email && (
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-blue-500" />
            <a href={`mailto:${profile.email}`} className="text-sm text-blue-600 hover:underline">
              {profile.email}
            </a>
          </div>
        )}
        
        {profile?.phone_number && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-blue-500" />
            <a href={`tel:${profile.phone_number}`} className="text-sm text-blue-600 hover:underline">
              {profile.phone_number}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerContactInfo;
