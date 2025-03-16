
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import FreelancerSignupForm, { FreelancerFormValues } from './components/FreelancerSignupForm';
import { createFreelancerProfile } from './services/freelancerProfileService';

const FreelancerSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleSubmit = async (data: FreelancerFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            profession: data.profession,
            location: data.location,
            email: data.email,
            user_type: 'freelancer'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (authData?.user) {
        const result = await createFreelancerProfile(authData.user.id, data);
        if (!result.success) {
          console.error('Profile creation warning:', result.error);
          // We don't throw here to not block signup, but we log for troubleshooting
        }
      }
      
      toast({
        title: 'Registration Successful',
        description: 'Please check your email to verify your account.',
      });
      
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
    <MainLayout>
      <div className="container flex items-center justify-center py-12">
        <Card className="w-full max-w-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign up as a Freelancer</CardTitle>
            <CardDescription className="text-center">
              Create an account to access construction projects across the UK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FreelancerSignupForm 
              onSubmit={handleSubmit}
              isLoading={isLoading}
              authError={authError}
            />
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-center text-sm">
              <span>Already have an account? </span>
              <Link to="/auth/login" className="text-primary hover:underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default FreelancerSignup;
