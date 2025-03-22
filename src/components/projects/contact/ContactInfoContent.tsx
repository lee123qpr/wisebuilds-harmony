
import React from 'react';
import { Building, Mail, MapPin, Phone, User, Globe } from 'lucide-react';
import ContactItem from './ContactItem';

export interface ClientContactData {
  contact_name: string | null;
  company_name: string | null;
  phone_number: string | null;
  email: string | null;
  website: string | null;
  company_address: string | null;
  user_id: string;
}

interface ContactInfoContentProps {
  clientInfo: ClientContactData;
}

const ContactInfoContent: React.FC<ContactInfoContentProps> = ({ clientInfo }) => {
  const formatPhoneForLink = (phone: string) => {
    if (!phone) return '';
    
    const digits = phone.replace(/\D/g, '');
    
    if (phone.startsWith('+')) {
      return phone;
    }
    
    if (digits.startsWith('00')) {
      return '+' + digits.substring(2);
    }
    
    return digits;
  };

  const formatWebsiteUrl = (website: string) => {
    if (!website) return '';
    return website.startsWith('http') ? website : `https://${website}`;
  };

  // Make sure we have a valid contact name
  const contactName = clientInfo.contact_name && clientInfo.contact_name.trim() !== '' 
    ? clientInfo.contact_name 
    : 'Client';
  
  console.log("ContactInfoContent displaying client info:", {
    contactName: clientInfo.contact_name,
    displayName: contactName,
    email: clientInfo.email,
    phone: clientInfo.phone_number
  });
  
  const hasEssentialContactInfo = !!(contactName || clientInfo.email || clientInfo.phone_number);

  if (!hasEssentialContactInfo) {
    return (
      <div className="text-yellow-700 p-2 bg-yellow-50 border border-yellow-100 rounded">
        <p>No contact information available for this client.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {contactName && (
        <ContactItem
          icon={<User className="h-4 w-4 text-green-700" />}
          label="Contact Name"
          value={contactName}
        />
      )}
      
      {clientInfo.email && (
        <ContactItem
          icon={<Mail className="h-4 w-4 text-green-700" />}
          label="Email"
          value={clientInfo.email}
          link={`mailto:${clientInfo.email}`}
        />
      )}
      
      {clientInfo.phone_number && (
        <ContactItem
          icon={<Phone className="h-4 w-4 text-green-700" />}
          label="Phone"
          value={clientInfo.phone_number}
          link={`tel:${formatPhoneForLink(clientInfo.phone_number)}`}
        />
      )}
      
      {clientInfo.company_name && (
        <ContactItem
          icon={<Building className="h-4 w-4 text-green-700" />}
          label="Company"
          value={clientInfo.company_name}
        />
      )}
      
      {clientInfo.website && (
        <ContactItem
          icon={<Globe className="h-4 w-4 text-green-700" />}
          label="Website"
          value={clientInfo.website}
          link={formatWebsiteUrl(clientInfo.website)}
        />
      )}
      
      {clientInfo.company_address && (
        <ContactItem
          icon={<MapPin className="h-4 w-4 text-green-700" />}
          label="Address"
          value={clientInfo.company_address}
        />
      )}
    </div>
  );
};

export default ContactInfoContent;
