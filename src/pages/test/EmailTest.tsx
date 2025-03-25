
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EmailTester from '@/components/test/EmailTester';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const EmailTest = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Email Test Page</h1>
            <p className="text-muted-foreground">
              Use this page to test the email sending functionality with Resend
            </p>
          </div>
          <Link to="/test">
            <Button variant="outline">Back to Test Dashboard</Button>
          </Link>
        </div>
        
        <div className="mt-8">
          <EmailTester />
        </div>
      </div>
    </MainLayout>
  );
};

export default EmailTest;
