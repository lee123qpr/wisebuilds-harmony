
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useCreateTestProject = () => {
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createTestProject = async (roleType: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create test projects",
        variant: "destructive",
      });
      return;
    }

    setIsCreating(true);

    try {
      // Creating a clear test project that can be identified by title
      const testProject = {
        title: `Test ${roleType} Project`,
        description: `This is a test project for a ${roleType} created for testing purposes. These test projects can be deleted by any user.`,
        budget: '1000_to_5000',
        role: roleType,
        location: 'Tamworth, UK', // Match the location in lead settings
        duration: 'less_than_week',
        work_type: 'any',
        requires_insurance: true,
        requires_site_visits: true,
        requires_equipment: false,
        user_id: user.id,
        status: 'active'
      };
      
      console.log('Creating test project with data:', testProject);
      
      const { data, error } = await supabase
        .from('projects')
        .insert(testProject)
        .select();
      
      if (error) {
        console.error('Error creating test project:', error);
        toast({
          title: "Error creating test project",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      console.log('Test project created successfully:', data);
      toast({
        title: "Test project created",
        description: `A new test ${roleType} project has been created. Any user can edit or delete test projects from the dashboard.`,
      });
      
      // Force refresh to show the new project
      window.location.reload();
    } catch (error: any) {
      console.error('Error in createTestProject:', error);
      toast({
        title: "Error creating test project",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return { createTestProject, isCreating };
};
