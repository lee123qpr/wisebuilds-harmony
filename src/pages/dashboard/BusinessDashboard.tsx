
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { useSearchParams } from 'react-router-dom';
import ProjectsTable from '@/components/projects/ProjectsTable';
import BusinessMessagesTab from '@/components/dashboard/business/MessagesTab';
import BusinessQuotesTab from '@/components/dashboard/business/QuotesTab';
import BusinessJobsTab from '@/components/dashboard/business/BusinessJobsTab';
import { supabase } from '@/integrations/supabase/client';
import ProjectsHeader from '@/components/dashboard/business/projects/ProjectsHeader';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('projects');
  const [contactName, setContactName] = useState('Business Client');
  const [isLoading, setIsLoading] = useState(true);
  const [projectCount, setProjectCount] = useState(0);
  
  // Set the active tab based on URL parameters
  useEffect(() => {
    if (tabParam && ['projects', 'my-hires', 'messages', 'quotes'].includes(tabParam)) {
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

        // Get project count
        const { count } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('client_id', user.id);
        
        setProjectCount(count || 0);
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
            <TabsTrigger value="my-hires">My Hires</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-6">
            <ProjectsHeader projectCount={projectCount} />
            <ProjectsTable />
          </TabsContent>
          
          <TabsContent value="my-hires" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <BusinessJobsTab />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <BusinessMessagesTab />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="quotes" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
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
