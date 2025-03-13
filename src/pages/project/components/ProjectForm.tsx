
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import ProjectDetailsFields from './ProjectDetailsFields';
import ProjectRequirementsFields from './ProjectRequirementsFields';
import { ProjectFormValues } from './schema';
import { NavigateFunction } from 'react-router-dom';

interface ProjectFormProps {
  form: UseFormReturn<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  submitting: boolean;
  projectId?: string;
  navigate: NavigateFunction;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ 
  form, 
  onSubmit, 
  submitting, 
  projectId,
  navigate
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Update your project details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <ProjectDetailsFields form={form} />
              <ProjectRequirementsFields form={form} />
              
              <div className="flex justify-end gap-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(`/project/${projectId}`)}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export default ProjectForm;
