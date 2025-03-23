
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Clock, Mail, MapPin, Phone, User, Globe } from 'lucide-react';
import { ClientProfileData } from '@/pages/client/types';

interface ClientInformationCardProps {
  clientProfile: ClientProfileData;
  formatDate: (dateString: string | null) => string;
}

const ClientInformationCard: React.FC<ClientInformationCardProps> = ({ clientProfile, formatDate }) => {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-blue-50 border-b">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <User className="h-5 w-5" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 pt-5">
        {clientProfile.contact_name && (
          <div className="flex items-start gap-3 transition-all hover:translate-x-1 duration-300">
            <User className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Contact Name</p>
              <p className="font-medium text-slate-800">{clientProfile.contact_name}</p>
            </div>
          </div>
        )}
        
        {clientProfile.email && (
          <div className="flex items-start gap-3 transition-all hover:translate-x-1 duration-300">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Email</p>
              <a href={`mailto:${clientProfile.email}`} className="font-medium text-blue-600 hover:underline">
                {clientProfile.email}
              </a>
            </div>
          </div>
        )}
        
        {clientProfile.phone_number && (
          <div className="flex items-start gap-3 transition-all hover:translate-x-1 duration-300">
            <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-500">Phone</p>
              <a href={`tel:${clientProfile.phone_number}`} className="font-medium text-blue-600 hover:underline">
                {clientProfile.phone_number}
              </a>
            </div>
          </div>
        )}
        
        <div className="flex items-start gap-3 transition-all hover:translate-x-1 duration-300">
          <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-500">Member Since</p>
            <p className="font-medium text-slate-800">{formatDate(clientProfile.member_since)}</p>
          </div>
        </div>
        
        {clientProfile.jobs_completed && clientProfile.jobs_completed > 0 && (
          <div className="flex items-start gap-3 transition-all hover:translate-x-1 duration-300">
            <div className="h-5 w-5 flex items-center justify-center bg-green-100 rounded-full text-green-600 mt-0.5">✓</div>
            <div>
              <p className="text-sm font-medium text-slate-500">Completed Jobs</p>
              <p className="font-medium text-slate-800">{clientProfile.jobs_completed}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientInformationCard;
