
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';

const EmptyLeadsMessage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>No Matching Leads Available</CardTitle>
            <CardDescription>
              We couldn't find any projects matching your current preferences
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={() => navigate('/dashboard/freelancer/lead-settings')}
          variant="outline"
          className="mt-4"
        >
          Update Lead Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyLeadsMessage;
