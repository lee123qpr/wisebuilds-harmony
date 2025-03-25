
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

const TestDashboard = () => {
  const testRoutes = [
    {
      name: 'Test Skeleton',
      path: '/test-skeleton',
      description: 'Basic skeleton test component'
    },
    {
      name: 'Freelancer Profile Cards',
      path: '/test/profile-cards',
      description: 'Various freelancer profile card components'
    },
    {
      name: 'Freelancer Detailed Profile',
      path: '/test/freelancer-detailed-profile',
      description: 'Compare how profiles look to freelancers vs clients'
    },
    {
      name: 'Client Profile Test',
      path: '/test/client-profile',
      description: 'Test view for client profiles'
    },
    {
      name: 'Freelancer Profile Test',
      path: '/test/freelancer-profile',
      description: 'Test view for freelancer profiles'
    },
    {
      name: 'Client View Freelancer',
      path: '/test/client-view-freelancer',
      description: 'Test how clients see freelancer profiles'
    },
    {
      name: 'Email Test',
      path: '/test/email-test',
      description: 'Test Resend email functionality'
    }
  ];

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Test Dashboard</h1>
          <p className="text-muted-foreground mb-4">
            Navigate to different test pages for component and feature testing
          </p>
          <Separator className="my-4" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testRoutes.map((route) => (
            <Card key={route.path} className="h-full flex flex-col">
              <CardHeader>
                <CardTitle>{route.name}</CardTitle>
                <CardDescription>{route.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Link to={route.path} className="w-full">
                  <Button variant="outline" className="w-full">Visit Test Page</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default TestDashboard;
