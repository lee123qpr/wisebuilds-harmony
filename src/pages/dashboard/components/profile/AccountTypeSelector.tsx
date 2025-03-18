
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AccountTypeSelectorProps {
  userId: string;
  currentType?: string;
  onTypeUpdated?: (type: string) => void;
}

const AccountTypeSelector = ({ userId, currentType, onTypeUpdated }: AccountTypeSelectorProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const setUserType = async (userType: 'freelancer' | 'business' | 'admin') => {
    if (!userId) return;
    
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('set-user-type', {
        body: { userId, userType }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to update account type');
      }

      toast({
        title: 'Account Type Updated',
        description: `Your account has been set to ${userType} type.`,
      });

      if (onTypeUpdated) {
        onTypeUpdated(userType);
      }
      
      // Refresh the page to apply changes
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (error) {
      console.error('Error setting user type:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error instanceof Error 
          ? error.message 
          : 'Failed to update account type. Please try again.',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-sm font-medium">Account Type</h3>
      <div className="flex items-center space-x-2">
        <Button
          variant={currentType === 'freelancer' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUserType('freelancer')}
          disabled={isUpdating || currentType === 'freelancer'}
        >
          <User className="mr-2 h-4 w-4" />
          Freelancer
        </Button>
        <Button
          variant={currentType === 'business' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUserType('business')}
          disabled={isUpdating || currentType === 'business'}
        >
          <User className="mr-2 h-4 w-4" />
          Business
        </Button>
      </div>
    </div>
  );
};

export default AccountTypeSelector;
