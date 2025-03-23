
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
  if (bucketAvailable === null) return null;

  return (
    <>
      {bucketAvailable === false && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Avatar Upload Unavailable</AlertTitle>
          <AlertDescription>
            The avatar storage service is currently unavailable. Available buckets: {availableBuckets.join(', ')}.
            {actualBucketName && <div>Tried to use bucket: {actualBucketName}</div>}
            Please try again later or contact support.
          </AlertDescription>
        </Alert>
      )}
      
      {bucketAvailable === true && actualBucketName && (
        <Alert className="mb-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Storage Bucket Info</AlertTitle>
          <AlertDescription>
            Using storage bucket: {actualBucketName}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default BucketStatusAlerts;
