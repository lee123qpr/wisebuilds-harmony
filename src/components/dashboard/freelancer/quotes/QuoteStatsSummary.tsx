
import React from 'react';
import { ApplicationWithProject } from '@/hooks/freelancer/useApplicationsWithQuotes';

interface QuoteStatsSummaryProps {
  applications: ApplicationWithProject[] | undefined;
}

const QuoteStatsSummary: React.FC<QuoteStatsSummaryProps> = ({ applications }) => {
  if (!applications || applications.length === 0) {
    return null;
  }
  
  // Count for each status
  const acceptedCount = applications.filter(p => p.quote_status === 'accepted').length || 0;
  const pendingCount = applications.filter(p => p.quote_status === 'pending').length || 0;
  const declinedCount = applications.filter(p => p.quote_status === 'declined').length || 0;
  const noQuoteCount = applications.filter(p => !p.quote_status).length || 0;
  
  return (
    <div className="grid grid-cols-4 gap-2 mb-4">
      <div className="bg-green-50 border border-green-200 rounded-md p-3">
        <div className="text-green-800 text-sm font-medium">Hired</div>
        <div className="text-2xl font-bold text-green-700">{acceptedCount}</div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <div className="text-yellow-800 text-sm font-medium">Pending</div>
        <div className="text-2xl font-bold text-yellow-700">{pendingCount}</div>
      </div>
      <div className="bg-red-50 border border-red-200 rounded-md p-3">
        <div className="text-red-800 text-sm font-medium">Declined</div>
        <div className="text-2xl font-bold text-red-700">{declinedCount}</div>
      </div>
      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <div className="text-gray-800 text-sm font-medium">No Quote Issued</div>
        <div className="text-2xl font-bold text-gray-700">{noQuoteCount}</div>
      </div>
    </div>
  );
};

export default QuoteStatsSummary;
