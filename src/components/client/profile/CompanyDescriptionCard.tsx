
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';

interface CompanyDescriptionCardProps {
  description: string;
}

const CompanyDescriptionCard: React.FC<CompanyDescriptionCardProps> = ({ description }) => {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-emerald-50 border-b">
        <CardTitle className="flex items-center gap-2 text-emerald-700">
          <Building className="h-5 w-5" />
          About the Company
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5">
        <p className="whitespace-pre-line text-slate-700 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default CompanyDescriptionCard;
