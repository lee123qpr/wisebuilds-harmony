
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Clock, 
  User, 
  Building, 
  FileText,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { supabase, ProjectDispute, projectDisputesTable } from '@/integrations/supabase/client';
import { toast } from '@/hooks/toast';
import { useAuth } from '@/context/AuthContext';

interface AdminDisputeDetailsProps {
  disputeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisputeResolved: () => void;
}

// Define the dispute data type with better typing for related tables
interface DetailedDisputeData extends ProjectDispute {
  freelancer?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  client?: {
    id: string;
    contact_name: string;
    company_name: string;
    email: string;
  };
  projects?: {
    id: string;
    title: string;
    status: string;
  };
  quotes?: {
    id: string;
    status: string;
  };
}

type Decision = 'client_favor' | 'freelancer_favor' | 'partial' | 'no_fault';

const AdminDisputeDetails: React.FC<AdminDisputeDetailsProps> = ({
  disputeId,
  open,
  onOpenChange,
  onDisputeResolved
}) => {
  const { user } = useAuth();
  const [adminNotes, setAdminNotes] = useState('');
  const [decision, setDecision] = useState<Decision | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: dispute, isLoading } = useQuery({
    queryKey: ['admin-dispute-details', disputeId],
    queryFn: async () => {
      const { data, error } = await projectDisputesTable()
        .select(`
          *,
          quotes:quote_id (id, status),
          projects:project_id (id, title, status),
          freelancer:quotes!inner (freelancer_id (id, first_name, last_name, email)),
          client:projects!inner (user_id (id, contact_name, company_name, email))
        `)
        .eq('id', disputeId)
        .single();
      
      if (error) {
        console.error('Error fetching dispute details:', error);
        throw error;
      }
      
      return data as unknown as DetailedDisputeData;
    },
    enabled: !!disputeId && open
  });
  
  const handleSubmitDecision = async () => {
    if (!decision || !adminNotes || !user) return;
    
    setIsSubmitting(true);
    
    try {
      // Update dispute record with admin decision
      const { error } = await projectDisputesTable()
        .update({
          admin_decision: decision,
          admin_notes: adminNotes,
          admin_decision_date: new Date().toISOString(),
          reviewed_by: user.id
        })
        .eq('id', disputeId);
      
      if (error) throw error;
      
      // Update quote status based on decision
      let newQuoteStatus = 'disputed';
      
      if (decision === 'client_favor') {
        newQuoteStatus = 'client_favored';
      } else if (decision === 'freelancer_favor') {
        newQuoteStatus = 'freelancer_favored';
      } else if (decision === 'partial') {
        newQuoteStatus = 'partially_complete';
      } else if (decision === 'no_fault') {
        newQuoteStatus = 'no_fault';
      }
      
      if (dispute?.quotes?.id) {
        const { error: quoteError } = await supabase
          .from('quotes')
          .update({ status: newQuoteStatus })
          .eq('id', dispute.quotes.id);
        
        if (quoteError) {
          console.error('Error updating quote status:', quoteError);
        }
      }
      
      toast({
        title: 'Decision submitted',
        description: 'Your decision has been recorded and the parties will be notified',
        variant: 'default'
      });
      
      onDisputeResolved();
    } catch (error) {
      console.error('Error submitting decision:', error);
      toast({
        title: 'Failed to submit decision',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Loading dispute details...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }
  
  if (!dispute) return null;
  
  const isDecided = dispute.admin_decision !== null;
  const freelancerEvidence = dispute.freelancer_evidence || [];
  const clientEvidence = dispute.client_evidence || [];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Dispute Details</DialogTitle>
          <DialogDescription>
            Review evidence and provide a decision for this dispute.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-semibold">{dispute.projects?.title}</h3>
              <p className="text-sm text-gray-500">Opened on {format(new Date(dispute.created_at), 'MMMM d, yyyy')}</p>
            </div>
            <Badge className={isDecided 
              ? "bg-green-100 text-green-700" 
              : "bg-amber-100 text-amber-700"
            }>
              {isDecided 
                ? <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Resolved</>
                : <><Clock className="h-3.5 w-3.5 mr-1" /> Awaiting Decision</>
              }
            </Badge>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Freelancer Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dispute.freelancer && (
                  <>
                    <p className="font-medium">{dispute.freelancer.first_name} {dispute.freelancer.last_name}</p>
                    <p className="text-sm text-gray-500">{dispute.freelancer.email}</p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Client Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dispute.client && (
                  <>
                    <p className="font-medium">{dispute.client.company_name || 'N/A'}</p>
                    <p className="text-sm">{dispute.client.contact_name}</p>
                    <p className="text-sm text-gray-500">{dispute.client.email}</p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="evidence" className="w-full">
            <TabsList>
              <TabsTrigger value="evidence">
                <FileText className="h-4 w-4 mr-2" />
                Evidence
              </TabsTrigger>
              <TabsTrigger value="decision" disabled={isDecided}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Make Decision
              </TabsTrigger>
              {isDecided && (
                <TabsTrigger value="resolution">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Resolution
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="evidence" className="space-y-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Dispute Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Reason for Dispute</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{dispute.reason}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">At Fault Statement</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{dispute.at_fault_statement}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-1">Evidence Files</h4>
                    {dispute.evidence_files && dispute.evidence_files.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {dispute.evidence_files.map((file: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-2 border rounded">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-sm truncate">{file.name}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No evidence files submitted</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="decision" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Admin Decision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Select Decision</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button 
                        variant={decision === 'client_favor' ? 'default' : 'outline'} 
                        className={decision === 'client_favor' ? 'bg-blue-600' : ''}
                        onClick={() => setDecision('client_favor')}
                      >
                        In Favor of Client
                      </Button>
                      <Button
                        variant={decision === 'freelancer_favor' ? 'default' : 'outline'}
                        className={decision === 'freelancer_favor' ? 'bg-blue-600' : ''}
                        onClick={() => setDecision('freelancer_favor')}
                      >
                        In Favor of Freelancer
                      </Button>
                      <Button
                        variant={decision === 'partial' ? 'default' : 'outline'}
                        className={decision === 'partial' ? 'bg-blue-600' : ''}
                        onClick={() => setDecision('partial')}
                      >
                        Partial Completion
                      </Button>
                      <Button
                        variant={decision === 'no_fault' ? 'default' : 'outline'}
                        className={decision === 'no_fault' ? 'bg-blue-600' : ''}
                        onClick={() => setDecision('no_fault')}
                      >
                        No Fault Found
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Decision Notes</h4>
                    <Textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Provide reasoning for your decision..."
                      className="min-h-32"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitDecision}
                  disabled={!decision || !adminNotes || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Decision'}
                </Button>
              </DialogFooter>
            </TabsContent>
            
            {isDecided && (
              <TabsContent value="resolution" className="space-y-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Decision Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Decision</h4>
                      <Badge className="bg-green-100 text-green-700">
                        {dispute.admin_decision === 'client_favor' && 'In Favor of Client'}
                        {dispute.admin_decision === 'freelancer_favor' && 'In Favor of Freelancer'}
                        {dispute.admin_decision === 'partial' && 'Partial Completion'}
                        {dispute.admin_decision === 'no_fault' && 'No Fault Found'}
                      </Badge>
                    </div>
                    
                    {dispute.admin_decision_date && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Decision Date</h4>
                        <p className="text-sm">{format(new Date(dispute.admin_decision_date), 'MMMM d, yyyy')}</p>
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Admin Notes</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded">{dispute.admin_notes}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDisputeDetails;
