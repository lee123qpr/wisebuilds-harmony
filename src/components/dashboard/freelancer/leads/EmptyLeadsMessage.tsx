
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';

const EmptyLeadsMessage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-t-0 rounded-t-none">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="rounded-full bg-blue-50 p-2">
            <Info className="h-6 w-6 text-blue-500" />
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">No Matching Leads Available</h3>
              <p className="text-gray-600">
                We couldn't find any projects matching your current preferences
              </p>
            </div>
            <Button 
              onClick={() => navigate('/dashboard/freelancer/lead-settings')}
              variant="outline"
              className="mt-2"
            >
              Update Lead Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyLeadsMessage;
