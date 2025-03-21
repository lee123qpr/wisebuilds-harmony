
import React from 'react';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface QuotesHeaderProps {
  totalQuotes: number;
}

const QuotesHeader: React.FC<QuotesHeaderProps> = ({ totalQuotes }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <FileText className="h-6 w-6 text-primary" />
      <h2 className="text-2xl font-bold tracking-tight">
        Quotes
      </h2>
      <Badge variant="secondary" className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-100">
        {totalQuotes}
      </Badge>
    </div>
  );
};

export default QuotesHeader;
