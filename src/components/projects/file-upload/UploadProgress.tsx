
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { UploadProgressProps } from './types';

const UploadProgress: React.FC<UploadProgressProps> = ({ progress }) => {
  return (
    <div className="mt-2">
      <Progress value={progress} className="h-2" />
      <p className="text-xs text-center mt-1">{progress}% complete</p>
    </div>
  );
};

export default UploadProgress;
