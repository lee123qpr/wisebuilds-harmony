
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EmailTester from '@/components/test/EmailTester';

const EmailTest = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Email Test Page</h1>
        <p className="text-muted-foreground mb-8">
          Use this page to test the email sending functionality with Resend
        </p>
        
        <div className="mt-8">
          <EmailTester />
        </div>
      </div>
    </MainLayout>
  );
};

export default EmailTest;
