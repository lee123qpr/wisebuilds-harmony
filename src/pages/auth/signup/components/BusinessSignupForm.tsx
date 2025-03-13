
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { businessSchema, BusinessFormValues } from '../types';
import CompanyInfoFields from './CompanyInfoFields';
import ContactInfoFields from './ContactInfoFields';
import PasswordFields from './PasswordFields';

type BusinessSignupFormProps = {
  onSubmit: (data: BusinessFormValues) => Promise<void>;
  isLoading: boolean;
  authError: string | null;
};

const BusinessSignupForm = ({ onSubmit, isLoading, authError }: BusinessSignupFormProps) => {
  const form = useForm<BusinessFormValues>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      companyAddress: '',
      companyDescription: '',
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
          <CompanyInfoFields form={form} isLoading={isLoading} />
          <ContactInfoFields form={form} isLoading={isLoading} />
          <PasswordFields form={form} isLoading={isLoading} />
          
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
              'Create Business Account'
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BusinessSignupForm;
