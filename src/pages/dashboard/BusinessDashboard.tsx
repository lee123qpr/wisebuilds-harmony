
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import BusinessTabs from './business/BusinessTabs';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const fullName = user?.user_metadata?.full_name || 'Business User';

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {fullName}</h1>
          <p className="text-muted-foreground">Manage your projects and connect with freelancers</p>
        </div>
        
        <BusinessTabs />
      </div>
    </MainLayout>
  );
};

export default BusinessDashboard;
