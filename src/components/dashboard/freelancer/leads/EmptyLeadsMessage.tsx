
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
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-blue-50 p-3 mb-4">
            <Info className="h-6 w-6 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No Matching Leads Available</h3>
          <p className="text-gray-600 mb-4 max-w-md">
            We couldn't find any projects matching your current preferences
          </p>
          <Button 
            onClick={() => navigate('/dashboard/freelancer/lead-settings')}
            variant="default"
            className="mt-2"
          >
            Update Lead Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyLeadsMessage;
