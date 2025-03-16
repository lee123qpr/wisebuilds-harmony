
import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface ContactInfoProps {
  email?: string;
  phoneNumber?: string;
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ email, phoneNumber }) => {
  if (!email && !phoneNumber) return null;
  
  return (
    <div>
      <p className="font-medium mb-2">Contact information:</p>
      <div className="space-y-2">
        {email && (
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`mailto:${email}`} className="text-sm text-blue-600 hover:underline">{email}</a>
          </div>
        )}
        
        {phoneNumber && (
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`tel:${phoneNumber}`} className="text-sm text-blue-600 hover:underline">{phoneNumber}</a>
          </div>
        )}
      </div>
    </div>
  );
};
