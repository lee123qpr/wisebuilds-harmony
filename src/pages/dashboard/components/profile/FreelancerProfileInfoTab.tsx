
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Edit, X } from 'lucide-react';
import FreelancerProfileForm from './FreelancerProfileForm';
import { freelancerProfileSchema } from './freelancerSchema';
import * as z from 'zod';

type FreelancerProfileInfoTabProps = {
  form: UseFormReturn<z.infer<typeof freelancerProfileSchema>>;
  isSaving: boolean;
  onSubmit: (values: z.infer<typeof freelancerProfileSchema>) => Promise<void>;
};

const FreelancerProfileInfoTab: React.FC<FreelancerProfileInfoTabProps> = ({ form, isSaving, onSubmit }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset();
    setIsEditing(false);
  };

  const handleSubmit = async (values: z.infer<typeof freelancerProfileSchema>) => {
    await onSubmit(values);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Professional Information</CardTitle>
          <CardDescription>
            Update your personal details and professional information
          </CardDescription>
        </div>
        {!isEditing && (
          <Button onClick={handleEdit} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FreelancerProfileForm form={form} disabled={!isEditing} />
            
            {isEditing && (
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancel} disabled={isSaving}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FreelancerProfileInfoTab;
