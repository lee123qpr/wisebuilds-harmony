
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, Shield, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminDisputeDetails from './components/disputes/AdminDisputeDetails';

// Define a type for our dispute data
interface DisputeData {
  id: string;
  created_at: string;
  project_id: string;
  quote_id: string;
  user_id: string;
  reason: string;
  at_fault_statement: string;
  evidence_files?: any[];
  submission_deadline: string;
  admin_decision_deadline: string;
  admin_decision?: string | null;
  admin_notes?: string | null;
  admin_decision_date?: string | null;
  reviewed_by?: string | null;
  projects?: {
    title: string;
    status: string;
  };
  quotes?: {
    status: string;
  };
  freelancer?: {
    first_name: string;
    last_name: string;
  };
  client?: {
    contact_name: string;
    company_name: string;
  };
}

const DisputesTab: React.FC = () => {
  const [selectedDisputeId, setSelectedDisputeId] = React.useState<string | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  
  const { data: disputes, isLoading, refetch } = useQuery({
    queryKey: ['admin-disputes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_disputes')
        .select(`
          *,
          quotes (status),
          projects (title, status),
          freelancer:quotes(freelancer_id(first_name, last_name)),
          client:projects(user_id(contact_name, company_name))
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });
  
  const handleViewDispute = (disputeId: string) => {
    setSelectedDisputeId(disputeId);
    setDetailsDialogOpen(true);
  };

  const handleDisputeResolved = () => {
    refetch();
    setDetailsDialogOpen(false);
  };
  
  const getStatusBadge = (dispute: DisputeData) => {
    const now = new Date();
    const isSubmissionPeriod = new Date(dispute.submission_deadline) > now;
    const isDecisionPeriod = !isSubmissionPeriod && new Date(dispute.admin_decision_deadline) > now;
    const isDecided = dispute.admin_decision !== null;
    
    if (isDecided) {
      return (
        <Badge className="bg-green-100 text-green-700 border-green-200">
          <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
          Resolved
        </Badge>
      );
    }
    
    if (isSubmissionPeriod) {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200">
          <Clock className="h-3.5 w-3.5 mr-1" />
          Evidence Collection
        </Badge>
      );
    }
    
    if (isDecisionPeriod) {
      return (
        <Badge className="bg-amber-100 text-amber-700 border-amber-200">
          <Shield className="h-3.5 w-3.5 mr-1" />
          Awaiting Decision
        </Badge>
      );
    }
    
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200">
        <XCircle className="h-3.5 w-3.5 mr-1" />
        Overdue
      </Badge>
    );
  };
  
  const renderTimeRemaining = (dispute: DisputeData) => {
    const now = new Date();
    const submissionDeadline = new Date(dispute.submission_deadline);
    const decisionDeadline = new Date(dispute.admin_decision_deadline);
    
    if (dispute.admin_decision !== null && dispute.admin_decision_date) {
      return <p className="text-sm text-gray-500">Decision made on {format(new Date(dispute.admin_decision_date), 'MMM d, yyyy')}</p>;
    }
    
    if (submissionDeadline > now) {
      const daysLeft = differenceInDays(submissionDeadline, now);
      return <p className="text-sm text-amber-600">{daysLeft} days left for evidence submission</p>;
    }
    
    if (decisionDeadline > now) {
      const daysLeft = differenceInDays(decisionDeadline, now);
      return <p className="text-sm text-amber-600">{daysLeft} days left for admin decision</p>;
    }
    
    return <p className="text-sm text-red-600">Decision deadline passed</p>;
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Project Disputes</h2>
        <p>Loading disputes...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Disputes</h2>
        <Badge className="bg-amber-100 text-amber-700">
          {disputes?.length || 0} Active Disputes
        </Badge>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Disputes</TabsTrigger>
          <TabsTrigger value="awaiting-evidence">Evidence Collection</TabsTrigger>
          <TabsTrigger value="awaiting-decision">Awaiting Decision</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-4">
          {disputes?.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium">No disputes found</h3>
              <p className="text-gray-500">There are currently no project disputes to review.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {disputes?.map((dispute: DisputeData) => (
                <Card key={dispute.id} className="border-l-4 border-l-amber-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="text-base">
                          {dispute.projects?.title || 'Project Dispute'}
                        </CardTitle>
                        <CardDescription>
                          Opened on {format(new Date(dispute.created_at), 'MMM d, yyyy')}
                        </CardDescription>
                      </div>
                      {getStatusBadge(dispute)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Freelancer:</span>
                        <span className="font-medium">
                          {dispute.freelancer?.first_name} {dispute.freelancer?.last_name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Client:</span>
                        <span className="font-medium">
                          {dispute.client?.company_name || dispute.client?.contact_name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Quote Status:</span>
                        <span className="font-medium capitalize">
                          {dispute.quotes?.status}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    {renderTimeRemaining(dispute)}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDispute(dispute.id)}
                    >
                      Review
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="awaiting-evidence" className="space-y-4 mt-4">
          {/* Filter for evidence collection period disputes here */}
        </TabsContent>
        
        <TabsContent value="awaiting-decision" className="space-y-4 mt-4">
          {/* Filter for awaiting decision disputes here */}
        </TabsContent>
        
        <TabsContent value="resolved" className="space-y-4 mt-4">
          {/* Filter for resolved disputes here */}
        </TabsContent>
      </Tabs>
      
      {selectedDisputeId && (
        <AdminDisputeDetails
          disputeId={selectedDisputeId}
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          onDisputeResolved={handleDisputeResolved}
        />
      )}
    </div>
  );
};

export default DisputesTab;
