
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface CardHeaderProps {
  projectTitle: string;
  isAccepted: boolean;
  roleFormatted: string;
}

const QuoteCardHeader: React.FC<CardHeaderProps> = ({
  projectTitle,
  isAccepted,
  roleFormatted,
}) => {
  return (
    <CardHeader className="pb-2">
      <div className="flex flex-wrap justify-between items-start gap-2">
        <div>
          <CardTitle className="text-xl">{projectTitle}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Looking for: <span className="font-medium text-primary">{roleFormatted}</span>
          </p>
        </div>
        {isAccepted && (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Quote Accepted
          </Badge>
        )}
      </div>
    </CardHeader>
  );
};

export default QuoteCardHeader;
