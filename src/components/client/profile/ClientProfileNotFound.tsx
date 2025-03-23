
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Building } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const ClientProfileNotFound: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <MainLayout>
      <div className="container max-w-5xl px-4 py-12 mx-auto">
        <Card className="border-none shadow-md">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <Building className="h-20 w-20 text-slate-300 mb-6" />
            <h1 className="text-2xl font-bold mb-2">Client Profile Not Found</h1>
            <p className="text-slate-500 mb-8 max-w-md">
              The client profile you're looking for doesn't exist or may have been removed.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Go Back
              </Button>
              <Button onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ClientProfileNotFound;
