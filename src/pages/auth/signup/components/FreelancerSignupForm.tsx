
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
import PersonalInfoFields from './PersonalInfoFields';
import ProfessionalInfoFields from './ProfessionalInfoFields';
import FreelancerPasswordFields from './FreelancerPasswordFields';

const freelancerSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  profession: z.string().min(1, { message: 'Please select your profession' }),
  location: z.string().min(2, { message: 'Please enter your location' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Please confirm your password' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type FreelancerFormValues = z.infer<typeof freelancerSchema>;

type FreelancerSignupFormProps = {
  onSubmit: (data: FreelancerFormValues) => Promise<void>;
  isLoading: boolean;
  authError: string | null;
};

const FreelancerSignupForm = ({ onSubmit, isLoading, authError }: FreelancerSignupFormProps) => {
  const form = useForm<FreelancerFormValues>({
    resolver: zodResolver(freelancerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      profession: '',
      location: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <>
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <PersonalInfoFields form={form} isLoading={isLoading} />
          
          <ProfessionalInfoFields form={form} isLoading={isLoading} />
          
          <FreelancerPasswordFields form={form} isLoading={isLoading} />
          
          <div className="text-sm">
            By creating an account, you agree to our{" "}
            <Link to="/legal/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/legal/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Freelancer Account'
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default FreelancerSignupForm;
