
import React, { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Briefcase, MessageSquare, ClipboardList, Bell, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

  // Check if user has lead settings
  useEffect(() => {
    const checkLeadSettings = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('lead_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching lead settings:', error);
          return;
        }
        
        setHasLeadSettings(!!data);
        setLeadSettings(data);
        
      } catch (error) {
        console.error('Error checking lead settings:', error);
      }
    };
    
    checkLeadSettings();
  }, [user]);

  // Fetch project leads matching user's criteria
  useEffect(() => {
    const fetchProjectLeads = async () => {
      if (!leadSettings) return;
      
      try {
        // In a real app, this would query from the backend with matching logic
        // For now, we'll just fetch some sample projects
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('role', leadSettings.role)
          .limit(3);
          
        if (error) throw error;
        
        // Convert to ProjectLead format
        const leads = data.map(project => ({
          id: project.id,
          title: project.title,
          description: project.description,
          budget: project.budget,
          role: project.role,
          created_at: project.created_at,
          location: project.location,
          tags: ['New', project.work_type]
        }));
        
        setProjectLeads(leads);
      } catch (error) {
        console.error('Error fetching project leads:', error);
      }
    };
    
    if (leadSettings) {
      fetchProjectLeads();
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
