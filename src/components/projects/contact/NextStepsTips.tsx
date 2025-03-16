
import React from 'react';
import { CheckCircle2, Clock, MessageCircle } from 'lucide-react';

const NextStepsTips: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mt-2">
      <div className="flex items-start gap-2">
        <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-blue-800 mb-1">Next Steps</h4>
          <ul className="text-sm text-blue-700 space-y-1.5">
            <li className="flex items-start gap-1.5">
              <Clock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>Reach out promptly to discuss requirements</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>Fully understand project scope and timeline</span>
            </li>
            <li className="flex items-start gap-1.5">
              <MessageCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>Provide a detailed quote to increase chances</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NextStepsTips;
