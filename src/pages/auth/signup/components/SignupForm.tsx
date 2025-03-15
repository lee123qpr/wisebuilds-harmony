
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { signupSchema, SignupFormValues } from '../types';
import AccountTypeSelector from './AccountTypeSelector';
import UserInfoFields from './UserInfoFields';
import PasswordFields from './PasswordFields';
import { createBusinessProfile } from '../services/businessProfileService';
import { createFreelancerProfile } from '../services/freelancerProfileService';

type SignupFormProps = {
  onSuccess?: () => void;
};

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: 'freelancer',
      email: '',
      fullName: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const userType = form.watch('userType');

  const onSubmit = async (data: SignupFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Prepare user metadata based on user type
      const metadata: Record<string, any> = {
        full_name: data.fullName,
        phone_number: data.phoneNumber,
        user_type: data.userType,
      };
      
      // Register with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Create appropriate profile record based on user type
      if (authData?.user) {
        if (data.userType === 'business') {
          // Create business profile with appropriate data
          await createBusinessProfile(authData.user.id, {
            companyName: '',
            contactName: data.fullName,
            email: data.email,
            phone: data.phoneNumber,
            companyAddress: '',
            companyDescription: '',
            password: '', // Not storing password in profile
            confirmPassword: '', // Not storing password in profile
          });
        } else if (data.userType === 'freelancer') {
          // Create freelancer profile with appropriate data
          await createFreelancerProfile(authData.user.id, {
            fullName: data.fullName,
            email: data.email,
            profession: '',
            location: '',
            password: '', // Not storing password in profile
            confirmPassword: '', // Not storing password in profile
          });
        }
        // Note: Admin users don't need a specific profile created
      }
      
      toast({
        title: 'Registration Successful',
        description: 'Please check your email to verify your account.',
      });
      
      // For now, redirect to login page after successful signup
      navigate('/auth/login');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setAuthError(error.message || 'Failed to create your account. Please try again.');
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: 'There was an error creating your account. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {authError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{authError}</AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AccountTypeSelector form={form} isLoading={isLoading} />
          <UserInfoFields form={form} isLoading={isLoading} />
          
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
              `Create ${
                userType === 'business' 
                  ? 'Business' 
                  : userType === 'freelancer' 
                    ? 'Freelancer' 
                    : 'Admin'
              } Account`
            )}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignupForm;
