
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { useSearchParams } from 'react-router-dom';
import NewProjectDialog from '@/components/projects/NewProjectDialog';
import ProjectsTable from '@/components/projects/ProjectsTable';
import BusinessMessagesTab from '@/components/dashboard/business/MessagesTab';
import BusinessQuotesTab from '@/components/dashboard/business/QuotesTab';
import { supabase } from '@/integrations/supabase/client';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('projects');
  const [contactName, setContactName] = useState('Business Client');
  const [isLoading, setIsLoading] = useState(true);
  
  // Set the active tab based on URL parameters
  useEffect(() => {
    if (tabParam && ['projects', 'applications', 'contracts', 'messages', 'quotes'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  // Fetch client profile data to get the contact name
  useEffect(() => {
    const fetchClientProfile = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('client_profiles')
          .select('contact_name')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Error fetching client profile:', error);
          return;
        }
        
        if (data && data.contact_name) {
          setContactName(data.contact_name);
        }
      } catch (error) {
        console.error('Error in fetchClientProfile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClientProfile();
  }, [user]);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {isLoading ? 'Loading...' : contactName}</h1>
          <p className="text-muted-foreground">Your business dashboard</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="projects">My Projects</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Project Management</h2>
              <NewProjectDialog />
            </div>
            
            <ProjectsTable />
          </TabsContent>
          
          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Applications</CardTitle>
                <CardDescription>Freelancers who have applied to your projects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">You don't have any applications yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contracts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contracts</CardTitle>
                <CardDescription>Active contracts with freelancers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">You don't have any active contracts.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Conversations with freelancers</CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessMessagesTab />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quotes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quotes</CardTitle>
                <CardDescription>Project quotes from freelancers</CardDescription>
              </CardHeader>
              <CardContent>
                <BusinessQuotesTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default BusinessDashboard;
