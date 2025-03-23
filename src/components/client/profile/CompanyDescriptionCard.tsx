
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';

interface CompanyDescriptionCardProps {
  description: string;
}

const CompanyDescriptionCard: React.FC<CompanyDescriptionCardProps> = ({ description }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          About the Company
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{description}</p>
      </CardContent>
    </Card>
  );
};

export default CompanyDescriptionCard;
