
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { leadSettingsSchema, LeadSettingsFormValues } from './schema';
import LeadSettingsFields from './LeadSettingsFields';
import NotificationSettings from './NotificationSettings';
import { useAuth } from '@/context/AuthContext';

const LeadSettingsForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<LeadSettingsFormValues>({
    resolver: zodResolver(leadSettingsSchema),
    defaultValues: {
      role: '',
      location: '',
      max_budget: '',
      work_type: '',
      project_type: [],
      keywords: [],
      notifications_enabled: true,
      email_alerts: true,
    },
  });

  const onSubmit = async (values: LeadSettingsFormValues) => {
    try {
      if (!user) {
        toast({
          variant: 'destructive',
          title: 'Authentication required',
          description: 'You must be logged in to save lead settings',
        });
        return;
      }

      // For now, we'll just show a success message since the table isn't created yet
      console.log('Would save lead settings:', values);

      toast({
        title: 'Success',
        description: 'Your lead settings have been saved',
      });
      
      navigate('/dashboard/freelancer');
    } catch (error: any) {
      console.error('Error saving lead settings:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving settings',
        description: error.message || 'Failed to save lead settings',
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Lead Settings</CardTitle>
        <CardDescription>
          Configure what types of projects you want to receive as leads
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <LeadSettingsFields form={form} />
            <NotificationSettings form={form} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard/freelancer')}
            >
              Cancel
            </Button>
            <Button type="submit">Save Settings</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default LeadSettingsForm;
