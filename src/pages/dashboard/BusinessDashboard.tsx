import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { useSearchParams } from 'react-router-dom';
import ProjectsTable from '@/components/projects/ProjectsTable';
import BusinessMessagesTab from '@/components/dashboard/business/MessagesTab';
import BusinessQuotesTab from '@/components/dashboard/business/QuotesTab';
import BusinessJobsTab from '@/components/dashboard/business/BusinessJobsTab';
import { supabase } from '@/integrations/supabase/client';
import ProjectsHeader from '@/components/dashboard/business/projects/ProjectsHeader';
import NewProjectDialog from '@/components/projects/NewProjectDialog';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState('projects');
  const [contactName, setContactName] = useState('Business Client');
  const [isLoading, setIsLoading] = useState(true);
  
  // Set the active tab based on URL parameters
  useEffect(() => {
    if (tabParam && ['projects', 'quotes', 'my-hires', 'messages'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  
  // Helper function to get the appropriate greeting based on time of day
  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  };
  
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
        <div className="mb-8 flex justify-between items-center">
          <div className="transition-all duration-300">
            <h1 className="text-3xl font-bold mb-2">{getTimeBasedGreeting()}, {isLoading ? 'Loading...' : contactName}</h1>
            <p className="text-muted-foreground">Your business dashboard</p>
          </div>
          <NewProjectDialog />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-slate-100 p-1">
            <TabsTrigger 
              value="projects"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              My Projects
            </TabsTrigger>
            <TabsTrigger 
              value="quotes"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              Quotes
            </TabsTrigger>
            <TabsTrigger 
              value="my-hires"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              My Hires
            </TabsTrigger>
            <TabsTrigger 
              value="messages"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
            >
              Messages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects" className="space-y-6">
            <ProjectsHeader />
            <ProjectsTable />
          </TabsContent>
          
          <TabsContent value="quotes" className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <BusinessQuotesTab />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="my-hires" className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <BusinessJobsTab />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <BusinessMessagesTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default BusinessDashboard;
