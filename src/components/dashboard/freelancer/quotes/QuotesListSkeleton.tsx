
import React from 'react';

const QuotesListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg"></div>
      ))}
    </div>
  );
};

export default QuotesListSkeleton;
