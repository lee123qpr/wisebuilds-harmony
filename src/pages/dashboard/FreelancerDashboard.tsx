
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Briefcase, MessageSquare, ClipboardList, Bell } from 'lucide-react';

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Extract user information
  const fullName = user?.user_metadata?.full_name || 'Freelancer';

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {fullName}</h1>
          <p className="text-muted-foreground">Your freelancer dashboard</p>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="available">Available Projects</TabsTrigger>
            <TabsTrigger value="applied">My Applications</TabsTrigger>
            <TabsTrigger value="active">Active Jobs</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <Card key={item}>
                  <CardHeader>
                    <CardTitle>Kitchen Renovation in Manchester</CardTitle>
                    <CardDescription>Posted 2 days ago · £2,000-£3,500</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">Looking for an experienced contractor to renovate a kitchen in a Victorian home.</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-muted text-xs px-2 py-1 rounded-full">Plumbing</span>
                      <span className="bg-muted text-xs px-2 py-1 rounded-full">Tiling</span>
                      <span className="bg-muted text-xs px-2 py-1 rounded-full">Carpentry</span>
                    </div>
                    <Button className="w-full">Apply Now</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="applied" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Applications</CardTitle>
                <CardDescription>Track the status of your project applications</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">You haven't applied to any projects yet.</p>
                <Button onClick={() => navigate('/marketplace')} className="w-full">
                  Browse Available Projects
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Jobs</CardTitle>
                <CardDescription>Projects you're currently working on</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">You don't have any active jobs at the moment.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Conversations with clients</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">You don't have any messages yet.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default FreelancerDashboard;
