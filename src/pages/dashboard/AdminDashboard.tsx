
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import { Users, Briefcase, BarChart4, Shield, UserCheck, AlertTriangle } from 'lucide-react';
import VerificationTab from './admin/VerificationTab';
import UsersTab from './admin/components/UsersTab';
import DisputesTab from './admin/DisputesTab';

const AdminDashboard = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform management and oversight</p>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="disputes" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Disputes
            </TabsTrigger>
            <TabsTrigger value="verifications" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Verifications
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="moderation" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Moderation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-6">
            <UsersTab />
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Project Management</h3>
              <p className="text-muted-foreground">This feature is coming soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="disputes" className="space-y-4">
            <DisputesTab />
          </TabsContent>
          
          <TabsContent value="verifications" className="space-y-4">
            <VerificationTab />
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Platform Analytics</h3>
              <p className="text-muted-foreground">Analytics dashboard coming soon.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="moderation" className="space-y-4">
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Content Moderation</h3>
              <p className="text-muted-foreground">Moderation tools coming soon.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
