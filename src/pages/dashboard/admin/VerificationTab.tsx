
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Eye, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

interface Verification {
  id: string;
  user_id: string;
  id_document_path: string;
  verification_status: string;
  submitted_at: string;
  created_at: string;
  admin_notes: string | null;
  user_email?: string;
  user_full_name?: string;
}

const VerificationTab = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const { toast } = useToast();

  // Fetch all pending verifications
  const fetchVerifications = async () => {
    setIsLoading(true);
    try {
      // Fetch verifications
      const { data, error } = await supabase
        .from('freelancer_verification')
        .select('*')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      
      // Get user emails for each verification
      const enhancedData = await Promise.all(data.map(async (verification) => {
        // Get user email
        const { data: emailData } = await supabase
          .rpc('get_user_email', { user_id: verification.user_id });
        
        // Get user metadata
        const { data: userData } = await supabase.auth.admin.getUserById(verification.user_id);
        
        return {
          ...verification,
          user_email: emailData?.[0]?.email || 'Unknown',
          user_full_name: userData?.user?.user_metadata?.full_name || 'Unknown'
        };
      }));
      
      setVerifications(enhancedData);
    } catch (error) {
      console.error('Error fetching verifications:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load verification requests.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // View document
  const viewDocument = async (verification: Verification) => {
    setSelectedVerification(verification);
    setAdminNotes(verification.admin_notes || '');
    
    try {
      if (verification.id_document_path) {
        const { data } = supabase.storage
          .from('id-documents')
          .getPublicUrl(verification.id_document_path);
        
        setDocumentUrl(data.publicUrl);
      } else {
        setDocumentUrl(null);
      }
      
      setDialogOpen(true);
    } catch (error) {
      console.error('Error getting document URL:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load document.'
      });
    }
  };

  // Update verification status
  const updateVerificationStatus = async (status: 'approved' | 'rejected') => {
    if (!selectedVerification) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('freelancer_verification')
        .update({
          verification_status: status,
          verified_at: new Date().toISOString(),
          verified_by: (await supabase.auth.getUser()).data.user?.id,
          admin_notes: adminNotes
        })
        .eq('id', selectedVerification.id);
      
      if (error) throw error;
      
      // Update local state
      setVerifications(prev => 
        prev.map(v => 
          v.id === selectedVerification.id 
            ? { ...v, verification_status: status, admin_notes: adminNotes } 
            : v
        )
      );
      
      toast({
        title: `Verification ${status === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `The verification request has been ${status}.`
      });
      
      setDialogOpen(false);
    } catch (error) {
      console.error(`Error ${status} verification:`, error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to ${status} verification.`
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Initialize
  useEffect(() => {
    fetchVerifications();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-amber-500">Pending</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>ID Verification Requests</CardTitle>
          <CardDescription>Review and approve freelancer ID verification documents</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : verifications.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No verification requests found.</p>
          ) : (
            <div className="space-y-4">
              {verifications.map((verification) => (
                <div key={verification.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{verification.user_full_name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{verification.user_full_name}</p>
                      <p className="text-sm text-muted-foreground">{verification.user_email}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        {getStatusBadge(verification.verification_status)}
                        <span className="text-xs text-muted-foreground">
                          Submitted: {format(new Date(verification.submitted_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => viewDocument(verification)}
                    className="flex items-center"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verification Document</DialogTitle>
            <DialogDescription>
              {selectedVerification && (
                <div className="space-y-1 mt-1">
                  <p>
                    <span className="font-medium">User:</span> {selectedVerification.user_full_name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {selectedVerification.user_email}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> {getStatusBadge(selectedVerification.verification_status)}
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {documentUrl ? (
              <div className="max-h-[400px] overflow-auto border rounded">
                {documentUrl.toLowerCase().endsWith('.pdf') ? (
                  <iframe src={documentUrl} className="w-full h-[400px]" title="ID Document"></iframe>
                ) : (
                  <img src={documentUrl} alt="ID Document" className="max-w-full" />
                )}
              </div>
            ) : (
              <p className="text-center py-10 text-muted-foreground">No document available.</p>
            )}
            
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Admin Notes</label>
              <Textarea 
                value={adminNotes} 
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this verification"
                disabled={isUpdating || selectedVerification?.verification_status !== 'pending'}
              />
            </div>
          </div>
          
          <DialogFooter>
            {selectedVerification?.verification_status === 'pending' && (
              <>
                <Button 
                  variant="destructive" 
                  onClick={() => updateVerificationStatus('rejected')}
                  disabled={isUpdating}
                >
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => updateVerificationStatus('approved')}
                  disabled={isUpdating}
                >
                  {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VerificationTab;
