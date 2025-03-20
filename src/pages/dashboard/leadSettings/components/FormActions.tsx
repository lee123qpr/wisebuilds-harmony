
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import BackButton from '@/components/common/BackButton';

interface FormActionsProps {
  isSubmitting: boolean;
  isLoading: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  isLoading 
}) => {
  const navigate = useNavigate();
  
  return (
    <CardFooter className="flex justify-between">
      <BackButton 
        to="/dashboard/freelancer"
        disabled={isSubmitting || isLoading}
      />
      <Button 
        type="submit" 
        disabled={isSubmitting || isLoading}
      >
        {isSubmitting ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-r-transparent"></span>
            Saving...
          </>
        ) : 'Save Settings'}
      </Button>
    </CardFooter>
  );
};
