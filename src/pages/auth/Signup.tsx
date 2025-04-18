
import React from 'react';
import { Card } from '@/components/ui/card';
import MainLayout from '@/components/layout/MainLayout';
import SignupForm from './signup/components/SignupForm';

const Signup = () => {
  return (
    <MainLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <Card className="w-full max-w-lg p-6 md:p-8">
          <SignupForm />
        </Card>
      </div>
    </MainLayout>
  );
};

export default Signup;
