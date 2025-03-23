import React from 'react';
import { QuoteWithFreelancer } from '@/types/quotes';
import { formatRole } from '@/utils/projectFormatters';

interface JobCardProps {
  quote: QuoteWithFreelancer;
  clientName: string;
  onStatusUpdate: () => void;
  user?: any; // Add the user prop to the interface
}

const JobCard: React.FC<JobCardProps> = ({ 
  quote, 
  clientName, 
  onStatusUpdate,
  user // Add the user prop parameter
}) => {
  // Format the role if present
  const role = quote.project?.role || 'Not specified';
  const roleFormatted = formatRole(role);

  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800">{quote.project?.title}</h3>
      <p className="text-sm text-gray-600">Client: {clientName}</p>
      <p className="text-sm text-gray-600">Role: {roleFormatted}</p>
      <div className="mt-2">
        {quote.status === 'accepted' && !quote.completed_at && (
          <button 
            onClick={onStatusUpdate}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Mark as Complete
          </button>
        )}
        {quote.status === 'accepted' && quote.completed_at && (
          <span className="text-green-500 font-semibold">Completed</span>
        )}
      </div>
    </div>
  );
};

export default JobCard;
