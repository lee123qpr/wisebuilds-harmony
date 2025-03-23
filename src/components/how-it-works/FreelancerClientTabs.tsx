
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserHardHat, Building2 } from 'lucide-react';

const FreelancerClientTabs = () => {
  const [activeTab, setActiveTab] = useState('freelancer');

  return (
    <div className="py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold mb-4">Who Are You?</h2>
          <p className="text-lg text-bw-gray-medium">
            Select your role to see how BuildWise UK works for you
          </p>
        </div>
        
        <Tabs defaultValue="freelancer" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="freelancer" className="flex items-center gap-2 py-3">
              <UserHardHat className={activeTab === 'freelancer' ? 'text-primary' : ''} size={20} />
              <span>Construction Professional</span>
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-2 py-3">
              <Building2 className={activeTab === 'client' ? 'text-primary' : ''} size={20} />
              <span>Construction Business</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="freelancer" className="mt-8 px-4 animate-fade-in">
            <div className="bg-bw-off-white p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-3">For Construction Professionals</h3>
              <p className="text-bw-gray-medium">
                As a skilled construction professional, BuildWise UK helps you find quality projects, 
                manage your workload, and build your reputation in the industry. Our platform makes it 
                easy to discover opportunities that match your skills and preferences.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="client" className="mt-8 px-4 animate-fade-in">
            <div className="bg-bw-off-white p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-bold mb-3">For Construction Businesses</h3>
              <p className="text-bw-gray-medium">
                BuildWise UK helps construction businesses quickly find verified, skilled professionals 
                for their projects. Our platform streamlines the hiring process, reduces administrative 
                burden, and ensures you find the perfect match for your specific requirements.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FreelancerClientTabs;
