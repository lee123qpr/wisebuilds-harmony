
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { signupSchema, SignupFormValues } from '../types';
import { Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const SignupForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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

  const onSubmit = (data: SignupFormValues) => {
    console.log(data);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Create an account</h1>
        <p className="text-muted-foreground">
          Choose your account type and fill in your details below
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-base font-semibold">Account Type</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    variant="outline"
                    className="justify-start w-full border rounded-lg p-1 bg-muted/5"
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                  >
                    <ToggleGroupItem 
                      value="freelancer" 
                      className="flex-1 py-2.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md"
                    >
                      Freelancer
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="business" 
                      className="flex-1 py-2.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md"
                    >
                      Client
                    </ToggleGroupItem>
                    <ToggleGroupItem 
                      value="admin" 
                      className="flex-1 py-2.5 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md"
                    >
                      Admin
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <p className="text-sm text-muted-foreground">
                  {userType === 'freelancer' 
                    ? "Select Freelancer if you're looking for construction projects"
                    : userType === 'business'
                      ? "Select Client if you want to post construction projects"
                      : "Select Admin for administrative access"}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="John Smith" 
                      className="pl-10" 
                      {...field} 
                    />
                    <User className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      type="email"
                      placeholder="name@example.com" 
                      className="pl-10" 
                      {...field}
                    />
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-semibold">Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="+44 7123 456789" 
                      className="pl-10" 
                      {...field}
                    />
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  </div>
                </FormControl>
                <p className="text-sm text-muted-foreground mt-1">UK or Ireland phone number only</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showConfirmPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="text-sm text-muted-foreground">
            By creating an account, you agree to our{" "}
            <Link to="/legal/terms" className="text-primary hover:underline font-medium">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/legal/privacy" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>
          </div>

          <Button type="submit" className="w-full py-6 text-base">
            Create {userType === 'business' ? 'Client' : userType === 'freelancer' ? 'Freelancer' : 'Admin'} Account
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline font-medium">
              Log in
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
