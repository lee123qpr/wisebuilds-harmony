
import React from 'react';
import { 
  TooltipContent
} from '@/components/ui/tooltip';
import { budgetCredits, durationCredits, hiringStatusCredits } from '@/hooks/leads/utils/calculateLeadCredits';

interface CreditCostBreakdownProps {
  project: any;
  requiredCredits: number;
}

const formatProjectValue = (value: string) => {
  if (!value) return 'N/A';
  
  if (value.includes('-') || value.includes('_plus')) {
    if (value === '0-500') return '£0-£500';
    if (value === '500-1000') return '£500-£1,000';
    if (value === '1000-2500') return '£1,000-£2,500';
    if (value === '2500-5000') return '£2,500-£5,000';
    if (value === '5000-10000') return '£5,000-£10,000';
    if (value === '10000_plus') return '£10,000+';
  }
  
  return value.replace(/_/g, ' ');
};

const CreditCostBreakdown: React.FC<CreditCostBreakdownProps> = ({ project, requiredCredits }) => {
  // Calculate credits for each attribute if we have a project
  const budgetCredit = project?.budget ? budgetCredits[project.budget as keyof typeof budgetCredits] || 0 : 0;
  const durationCredit = project?.duration ? durationCredits[project.duration as keyof typeof durationCredits] || 0 : 0;
  const hiringStatusCredit = project?.hiring_status ? hiringStatusCredits[project.hiring_status as keyof typeof hiringStatusCredits] || 0 : 0;
  const baseCredit = 1;
  
  return (
    <TooltipContent className="p-3 w-64">
      <div className="text-sm">
        <div className="font-semibold mb-2">Credit Cost Breakdown:</div>
        {project ? (
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Budget ({formatProjectValue(project.budget)}):</span>
              <span className="font-medium">{budgetCredit} credit{budgetCredit !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration ({formatProjectValue(project.duration)}):</span>
              <span className="font-medium">{durationCredit} credit{durationCredit !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span>Hiring Status ({formatProjectValue(project.hiring_status)}):</span>
              <span className="font-medium">{hiringStatusCredit} credit{hiringStatusCredit !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span>Base Credit:</span>
              <span className="font-medium">{baseCredit} credit</span>
            </div>
            <div className="flex justify-between pt-2 mt-1 border-t border-gray-200 font-bold">
              <span>Total:</span>
              <span>{requiredCredits} credit{requiredCredits !== 1 ? 's' : ''}</span>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 italic">Project details not available</div>
        )}
      </div>
    </TooltipContent>
  );
};

export default CreditCostBreakdown;
