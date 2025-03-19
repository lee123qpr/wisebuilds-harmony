
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { LinkIcon } from 'lucide-react';

interface ContactInformationSectionProps {
  profile: FreelancerProfile;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({ profile }) => {
  return (
    <div>
      <h3 className="text-md font-medium mb-3">Contact Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
          <p>{profile.phone_number || 'Not provided'}</p>
        </div>
        {profile.website && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">Website</p>
            <div className="flex items-center">
              <LinkIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {profile.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInformationSection;
