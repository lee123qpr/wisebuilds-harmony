
import React from 'react';
import { AlertCircle } from 'lucide-react';

const EmptyQuotesState: React.FC = () => {
  return (
    <div className="border rounded-md p-8 bg-gray-50 text-center">
      <AlertCircle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium mb-2">No quotes to compare</h3>
      <p className="text-muted-foreground">
        There are no quotes available for comparison at this time.
      </p>
    </div>
  );
};

export default EmptyQuotesState;
