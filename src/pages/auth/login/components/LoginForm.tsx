
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

// Development flag - matches the one in ProtectedRoute
const BYPASS_AUTH_FOR_DEVELOPMENT = true;

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        throw error;
      }
      
      const userType = authData.user?.user_metadata?.user_type;
      
      toast({
        title: 'Login Successful',
        description: 'Redirecting to your dashboard...',
      });
      
      if (userType === 'freelancer') {
        navigate('/dashboard/freelancer');
      } else if (userType === 'business') {
        navigate('/dashboard/business');
      } else if (userType === 'admin') {
        navigate('/dashboard/admin');
      } else {
        navigate('/');
      }
      
    } catch (error: any) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Failed to sign in. Please check your credentials.');
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Development-only function to access admin dashboard
  const goToAdminDashboard = () => {
    navigate('/dashboard/admin');
    toast({
      title: 'Development Mode',
      description: 'Accessing admin dashboard in development mode',
    });
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
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Log in'
            )}
          </Button>

          {/* Development-only Admin dashboard access button */}
          {BYPASS_AUTH_FOR_DEVELOPMENT && (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-2" 
              onClick={goToAdminDashboard}
            >
              Access Admin Dashboard (Dev Mode)
            </Button>
          )}
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
