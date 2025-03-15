
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Verification } from '../types';

interface VerificationDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  verification: Verification | null;
  documentUrl: string | null;
  adminNotes: string;
  onAdminNotesChange: (notes: string) => void;
  isUpdating: boolean;
  onApprove: () => void;
  onReject: () => void;
}

const VerificationDetailDialog: React.FC<VerificationDetailDialogProps> = ({
  open,
  onOpenChange,
  verification,
  documentUrl,
  adminNotes,
  onAdminNotesChange,
  isUpdating,
  onApprove,
  onReject,
}) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Verification Document</DialogTitle>
          <DialogDescription>
            {verification && (
              <div className="space-y-1 mt-1">
                <p>
                  <span className="font-medium">User:</span> {verification.user_full_name}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {verification.user_email}
                </p>
                <p>
                  <span className="font-medium">Status:</span> {getStatusBadge(verification.verification_status)}
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
              onChange={(e) => onAdminNotesChange(e.target.value)}
              placeholder="Add notes about this verification"
              disabled={isUpdating || verification?.verification_status !== 'pending'}
            />
          </div>
        </div>
        
        <DialogFooter>
          {verification?.verification_status === 'pending' && (
            <>
              <Button 
                variant="destructive" 
                onClick={onReject}
                disabled={isUpdating}
              >
                {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button 
                variant="default" 
                onClick={onApprove}
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
  );
};

export default VerificationDetailDialog;
