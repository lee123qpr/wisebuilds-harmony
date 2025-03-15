
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import MainLayout from '@/components/layout/MainLayout';
import { supabase } from '@/integrations/supabase/client';
import { BusinessFormValues } from './types';
import BusinessSignupForm from './components/BusinessSignupForm';

const BusinessSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const handleSubmit = async (data: BusinessFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      // Register with Supabase
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            company_name: data.companyName,
            contact_name: data.contactName,
            phone: data.phone,
            company_address: data.companyAddress,
            company_description: data.companyDescription,
            user_type: 'business'
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Create client profile record with the same information
      if (authData?.user) {
        const { error: profileError } = await supabase
          .from('client_profiles')
          .insert({
            id: authData.user.id,
            company_name: data.companyName,
            contact_name: data.contactName,
            phone_number: data.phone,
            company_address: data.companyAddress,
            company_description: data.companyDescription,
            member_since: new Date().toISOString(),
          });
        
        if (profileError) {
          console.error('Error creating client profile:', profileError);
          // We don't throw here to not block registration
        }
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
    <MainLayout>
      <div className="container flex items-center justify-center py-12">
        <Card className="w-full max-w-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign up as a Business</CardTitle>
            <CardDescription className="text-center">
              Create an account to post construction projects and find the right professionals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BusinessSignupForm 
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

export default BusinessSignup;
