
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuoteDetailsDebugInfoProps {
  status: string;
  updatedAt: string;
  onRefresh: () => Promise<void>;
}

/**
 * This component is deprecated and no longer in use.
 * It was previously used to display debug information and a refresh button
 * for the quote details page.
 */
const QuoteDetailsDebugInfo: React.FC<QuoteDetailsDebugInfoProps> = ({
  status,
  updatedAt,
  onRefresh,
}) => {
  return (
    <div className="mb-4 p-2 bg-gray-100 rounded text-xs font-mono">
      <p>Current Quote Status: <span className="font-bold">{status}</span></p>
      <p>Last Updated: {new Date(updatedAt).toLocaleString()}</p>
      <Button size="sm" variant="outline" onClick={onRefresh} className="mt-1">
        Refresh Data
      </Button>
    </div>
  );
};

export default QuoteDetailsDebugInfo;
