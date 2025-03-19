
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FreelancerProfileNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p>Profile not found or could not be loaded.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </CardContent>
    </Card>
  );
};

export default FreelancerProfileNotFound;
