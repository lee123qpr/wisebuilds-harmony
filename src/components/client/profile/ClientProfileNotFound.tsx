
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ClientProfileNotFound = () => {
  return (
    <div className="mt-6">
      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <h2 className="text-xl font-semibold text-red-700 mb-2">Client Profile Not Found</h2>
          <p className="text-red-600">
            We couldn't find the client profile you're looking for. The client may have deleted their account or you may have followed an invalid link.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientProfileNotFound;
