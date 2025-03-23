
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { LinkIcon, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ContactInformationSectionProps {
  profile: FreelancerProfile;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({ profile }) => {
  return (
    <div>
      <h3 className="text-md font-medium mb-3 text-primary-foreground/80">Contact Information</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {profile.phone_number && (
          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
              <a href={`tel:${profile.phone_number}`} className="font-medium text-primary hover:underline">
                {profile.phone_number}
              </a>
            </div>
          </div>
        )}
        
        {profile.email && (
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <a href={`mailto:${profile.email}`} className="font-medium text-primary hover:underline">
                {profile.email}
              </a>
            </div>
          </div>
        )}
        
        {profile.website && (
          <div className="flex items-start gap-2 col-span-full">
            <LinkIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Website</p>
              <a 
                href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-medium text-primary hover:underline"
              >
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
