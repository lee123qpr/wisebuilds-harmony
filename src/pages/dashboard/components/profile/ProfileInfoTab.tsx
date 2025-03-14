
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';
import ProfileForm from './ProfileForm';
import { clientProfileSchema } from './schema';
import * as z from 'zod';

type ProfileInfoTabProps = {
  form: UseFormReturn<z.infer<typeof clientProfileSchema>>;
  isSaving: boolean;
  onSubmit: (values: z.infer<typeof clientProfileSchema>) => Promise<void>;
};

const ProfileInfoTab: React.FC<ProfileInfoTabProps> = ({ form, isSaving, onSubmit }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Information</CardTitle>
        <CardDescription>
          Update your company details and contact information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ProfileForm form={form} />
            
            <div className="flex justify-end">
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileInfoTab;
