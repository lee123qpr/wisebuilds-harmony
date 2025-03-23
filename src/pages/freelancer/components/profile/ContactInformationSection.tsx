
import React from 'react';
import { FreelancerProfile } from '@/types/applications';
import { LinkIcon, Mail, Phone } from 'lucide-react';

interface ContactInformationSectionProps {
  profile: FreelancerProfile;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({ profile }) => {
  return (
    <div className="bg-card rounded-lg p-5 shadow-sm border border-border/40">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <div className="bg-primary/10 p-1.5 rounded-md">
          <Mail className="h-4 w-4 text-primary" />
        </div>
        <span>Contact Information</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {profile.phone_number && (
          <div className="bg-muted/50 rounded-md p-3 flex items-start gap-3">
            <Phone className="h-5 w-5 mt-0.5 text-primary/80" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
              <a href={`tel:${profile.phone_number}`} className="font-medium text-primary hover:underline">
                {profile.phone_number}
              </a>
            </div>
          </div>
        )}
        
        {profile.email && (
          <div className="bg-muted/50 rounded-md p-3 flex items-start gap-3">
            <Mail className="h-5 w-5 mt-0.5 text-primary/80" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <a href={`mailto:${profile.email}`} className="font-medium text-primary hover:underline">
                {profile.email}
              </a>
            </div>
          </div>
        )}
        
        {profile.website && (
          <div className="bg-muted/50 rounded-md p-3 flex items-start gap-3 col-span-full">
            <LinkIcon className="h-5 w-5 mt-0.5 text-primary/80" />
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
