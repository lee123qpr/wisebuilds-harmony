
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const FreelancerProfileHeader: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-2 mb-6">
      <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold">Freelancer Profile</h1>
    </div>
  );
};

export default FreelancerProfileHeader;
