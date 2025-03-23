
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface FormActionsProps {
  isSubmitting: boolean;
  isLoading: boolean;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  isSubmitting, 
  isLoading 
}) => {
  return (
    <CardFooter className="flex justify-end">
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
