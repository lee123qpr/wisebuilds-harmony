import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Briefcase, MessageSquare, ClipboardList, Bell, Settings } from 'lucide-react';

interface LeadSettings {
  role: string;
  location: string;
  work_type?: string;
  max_budget?: string;
  notifications_enabled: boolean;
}

interface ProjectLead {
  id: string;
  title: string;
  description: string;
  budget: string;
  role: string;
  created_at: string;
  location: string;
  tags?: string[];
}

const FreelancerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasLeadSettings, setHasLeadSettings] = useState<boolean>(false);
  const [leadSettings, setLeadSettings] = useState<LeadSettings | null>(null);
  const [projectLeads, setProjectLeads] = useState<ProjectLead[]>([]);
  
  // Extract user information
  const fullName = user?.user_metadata?.full_name || 'Freelancer';

  // For now, let's just check if we have lead settings instead of querying Supabase
  // due to table not being set up yet
  useEffect(() => {
    // We'll simulate lead settings for now since the table doesn't exist yet
    setHasLeadSettings(false);
    setLeadSettings(null);
  }, [user]);

  // Mock project leads data for demonstration
  useEffect(() => {
    if (leadSettings) {
      // Sample project leads
      const leads: ProjectLead[] = [
        {
          id: '1',
          title: 'Kitchen Renovation in Manchester',
          description: 'Looking for an experienced contractor to renovate a kitchen in a Victorian home.',
          budget: '£2,000-£3,500',
          role: 'Contractor',
          created_at: new Date().toISOString(),
          location: 'Manchester',
          tags: ['Plumbing', 'Tiling', 'Carpentry']
        },
        {
          id: '2',
          title: 'Bathroom Remodel',
          description: 'Complete bathroom renovation needed for a modern apartment.',
          budget: '£3,000-£5,000',
          role: 'Plumber',
          created_at: new Date().toISOString(),
          location: 'Liverpool',
          tags: ['Plumbing', 'Tiling']
        }
      ];
      
      setProjectLeads(leads);
    }
  }, [leadSettings]);

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {fullName}</h1>
            <p className="text-muted-foreground">Your freelancer dashboard</p>
          </div>
          <Button 
            onClick={() => navigate('/dashboard/freelancer/lead-settings')}
            className="flex items-center gap-2"
          >
            <Settings size={16} />
            {hasLeadSettings ? 'Update Lead Settings' : 'Set Up Lead Settings'}
          </Button>
        </div>

        <Tabs defaultValue="available" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="available">Available Projects</TabsTrigger>
            <TabsTrigger value="leads">My Leads</TabsTrigger>
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
          
          <TabsContent value="leads" className="space-y-6">
            {!hasLeadSettings ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Lead Settings</CardTitle>
                  <CardDescription>Set up your lead preferences to get customized project recommendations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate('/dashboard/freelancer/lead-settings')}
                    className="w-full"
                  >
                    Set Up Lead Settings
                  </Button>
                </CardContent>
              </Card>
            ) : projectLeads.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projectLeads.map((lead) => (
                  <Card key={lead.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{lead.title}</CardTitle>
                        <div className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full">
                          New Lead
                        </div>
                      </div>
                      <CardDescription>
                        {new Date(lead.created_at).toLocaleDateString()} · {lead.budget}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4 line-clamp-3">{lead.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-muted text-xs px-2 py-1 rounded-full">{lead.role}</span>
                        <span className="bg-muted text-xs px-2 py-1 rounded-full">{lead.location}</span>
                        {lead.tags?.map((tag, i) => (
                          <span key={i} className="bg-muted text-xs px-2 py-1 rounded-full">{tag}</span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          View Details
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Purchase Lead
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Leads Available</CardTitle>
                  <CardDescription>We'll notify you when projects matching your preferences become available</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => navigate('/dashboard/freelancer/lead-settings')}
                    variant="outline"
                  >
                    Update Lead Settings
                  </Button>
                </CardContent>
              </Card>
            )}
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
