
import React from 'react';
import { PoundSterling } from 'lucide-react';

interface FreelancerRateDisplayProps {
  hourlyRate: string | null;
}

const FreelancerRateDisplay: React.FC<FreelancerRateDisplayProps> = ({ hourlyRate }) => {
  if (!hourlyRate) return null;
  
  return (
    <div className="flex items-center gap-1 text-primary font-medium">
      <PoundSterling className="h-3.5 w-3.5" />
      <span>{hourlyRate}/hr</span>
    </div>
  );
};

export default FreelancerRateDisplay;
