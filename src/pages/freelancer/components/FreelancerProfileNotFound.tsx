
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/common/BackButton';

const FreelancerProfileNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <BackButton />
      </div>
      <Card>
        <CardContent className="p-6 text-center">
          <p className="mb-4">Profile not found or could not be loaded.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FreelancerProfileNotFound;
