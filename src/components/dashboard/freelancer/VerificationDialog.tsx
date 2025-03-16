
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Upload, Loader2, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useVerification } from '@/hooks/verification';
import { setupVerificationSystem } from '@/hooks/verification/setupVerification';
import { useToast } from '@/hooks/use-toast';

const VerificationDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [setupComplete, setSetupComplete] = useState<boolean>(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const { 
    uploadVerificationDocument, 
    deleteVerificationDocument,
    isUploading, 
    isDeleting,
    verificationStatus, 
    verificationData,
    refreshVerificationStatus 
  } = useVerification();
  const { toast } = useToast();

  // Run verification system setup on component mount
  useEffect(() => {
    if (open && !setupComplete) {
      const runSetup = async () => {
        const success = await setupVerificationSystem();
        setSetupComplete(success);
        if (!success) {
          toast({
            variant: 'destructive',
            title: 'Setup Error',
            description: 'There was a problem setting up the verification system. Please try again later.',
          });
        }
      };
      
      runSetup();
    }
  }, [open, setupComplete, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Invalid file type',
          description: 'Please upload a JPEG, PNG or PDF file.',
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload a file smaller than 5MB.',
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a file to upload.',
      });
      return;
    }

    if (!setupComplete) {
      toast({
        variant: 'destructive',
        title: 'System not ready',
        description: 'Verification system is still setting up. Please try again in a moment.',
      });
      return;
    }

    console.log('Submitting file for verification:', selectedFile.name);
    const result = await uploadVerificationDocument(selectedFile);
    console.log('Upload result:', result);
    
    if (result) {
      setSelectedFile(null);
      setOpen(false);
      
      // Refresh verification status after upload
      await refreshVerificationStatus();
    }
  };

  const handleDelete = async () => {
    const result = await deleteVerificationDocument();
    if (result) {
      setConfirmDeleteOpen(false);
      setOpen(false);
    }
  };

  const getButtonLabel = () => {
    switch (verificationStatus) {
      case 'approved':
        return 'Verified';
      case 'pending':
        return 'Verification Pending';
      case 'rejected':
        return 'Re-submit Verification';
      default:
        return 'Verify Your Identity';
    }
  };

  // Check if it's a new verification or rejected to allow resubmission
  const canSubmit = verificationStatus !== 'approved' && verificationStatus !== 'pending';
  // Document has been submitted but not approved yet, so can be deleted
  const canDelete = verificationStatus === 'pending' || verificationStatus === 'rejected';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={verificationStatus === 'approved' ? 'ghost' : 'outline'} 
          className="flex items-center gap-2"
          disabled={verificationStatus === 'approved'}
        >
          <ShieldCheck className="h-4 w-4" />
          {getButtonLabel()}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Identity Verification</DialogTitle>
          <DialogDescription>
            Upload a government-issued ID (passport, driver's license, or national ID card) to verify your identity.
            <span className="text-orange-500 font-medium block mt-1">
              Note: Must be a UK or Ireland issued document.
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Your document will be reviewed by our team. This process usually takes 1-2 business days.
          </p>
          
          {canSubmit && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="id-document"
                onChange={handleFileChange}
                accept="image/jpeg,image/png,application/pdf"
                className="hidden"
                disabled={isUploading || !setupComplete}
              />
              <label
                htmlFor="id-document"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                {!setupComplete ? (
                  <Loader2 className="h-8 w-8 text-gray-400 mb-2 animate-spin" />
                ) : (
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                )}
                <p className="text-sm text-gray-600 font-medium">
                  {!setupComplete 
                    ? 'Setting up verification system...' 
                    : 'Click to upload your ID document'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG or PDF (max. 5MB)
                </p>
                <p className="text-xs text-orange-500 mt-1">
                  UK or Ireland documents only
                </p>
              </label>
            </div>
          )}
          
          {canDelete && verificationData?.id_document_path && (
            <div className="bg-green-50 p-4 rounded-md border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Document submitted</p>
                  <p className="text-xs text-gray-500">
                    Submitted on: {new Date(verificationData.submitted_at || '').toLocaleDateString()}
                  </p>
                </div>
                <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isDeleting}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete verification document?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete your submitted document and reset your verification status. 
                        You'll need to submit a new document for verification.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          'Delete'
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
          
          {selectedFile && (
            <div className="text-sm">
              Selected file: <span className="font-medium">{selectedFile.name}</span>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isUploading || isDeleting}>
            Cancel
          </Button>
          {canSubmit && selectedFile && (
            <Button 
              onClick={handleSubmit} 
              disabled={!selectedFile || isUploading || !setupComplete}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                'Submit for Verification'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
