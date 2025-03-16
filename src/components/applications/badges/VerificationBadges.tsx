
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CheckCircle2 } from 'lucide-react';

interface VerificationBadgesProps {
  isEmailVerified?: boolean;
  isIdVerified?: boolean;
}

export const VerificationBadges: React.FC<VerificationBadgesProps> = ({ 
  isEmailVerified, 
  isIdVerified 
}) => {
  if (!isEmailVerified && !isIdVerified) return null;
  
  return (
    <div className="flex flex-col items-center gap-1">
      {isEmailVerified && (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Email Verified
        </Badge>
      )}
      
      {isIdVerified && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          ID Verified
        </Badge>
      )}
    </div>
  );
};
