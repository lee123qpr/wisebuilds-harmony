
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from 'react-router-dom';
import BusinessMessagesTab from '@/components/dashboard/business/MessagesTab';

const BusinessTabs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabFromParams = searchParams.get('tab');
  
  // Get the active tab from URL params, localStorage, or default to 'projects'
  const getInitialTab = () => {
    if (tabFromParams) {
      return tabFromParams;
    }
    
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('business-active-tab');
      return savedTab || 'projects';
    }
    return 'projects';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  // Update active tab when URL params change
  useEffect(() => {
    if (tabFromParams) {
      setActiveTab(tabFromParams);
    }
  }, [tabFromParams]);
  
  // Save the active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('business-active-tab', activeTab);
  }, [activeTab]);
  
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="projects">My Projects</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
        <TabsTrigger value="contracts">Contracts</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
      </TabsList>
      
      <TabsContent value="projects" className="pt-2">
        <p>Projects content will go here</p>
      </TabsContent>
      
      <TabsContent value="applications" className="pt-2">
        <p>Applications content will go here</p>
      </TabsContent>
      
      <TabsContent value="contracts" className="pt-2">
        <p>Contracts content will go here</p>
      </TabsContent>
      
      <TabsContent value="messages" className="pt-2">
        <BusinessMessagesTab />
      </TabsContent>
    </Tabs>
  );
};

export default BusinessTabs;
