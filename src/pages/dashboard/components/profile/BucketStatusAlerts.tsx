
import React from 'react';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface BucketStatusAlertsProps {
  bucketAvailable: boolean | null;
  actualBucketName: string | null;
  availableBuckets: string[];
}

const BucketStatusAlerts: React.FC<BucketStatusAlertsProps> = ({
  bucketAvailable,
  actualBucketName,
  availableBuckets
}) => {
  // Don't show anything if we're still checking bucket status or if bucket is available
  if (bucketAvailable === null || bucketAvailable === true) return null;

  return (
    <>
      {bucketAvailable === false && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Storage Service Status</AlertTitle>
          <AlertDescription>
            {availableBuckets.length > 0 
              ? `Using fallback storage bucket: ${availableBuckets[0]}. Please contact support if you encounter upload issues.`
              : 'No storage buckets available. Profile image uploads are currently unavailable. Please try again later or contact support.'}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default BucketStatusAlerts;
