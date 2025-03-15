
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Upload, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useVerification } from '@/hooks/useVerification';
import { useToast } from '@/hooks/use-toast';

const VerificationDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { uploadVerificationDocument, isUploading, verificationStatus } = useVerification();
  const { toast } = useToast();

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

    const result = await uploadVerificationDocument(selectedFile);
    if (result) {
      setSelectedFile(null);
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

  const isDisabled = verificationStatus === 'approved' || verificationStatus === 'pending';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={verificationStatus === 'approved' ? 'ghost' : 'outline'} 
          className="flex items-center gap-2"
          disabled={isDisabled}
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
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            Your document will be reviewed by our team. This process usually takes 1-2 business days.
          </p>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              id="id-document"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,application/pdf"
              className="hidden"
              disabled={isUploading}
            />
            <label
              htmlFor="id-document"
              className="flex flex-col items-center justify-center cursor-pointer"
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                Click to upload your ID document
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPEG, PNG or PDF (max. 5MB)
              </p>
            </label>
          </div>
          
          {selectedFile && (
            <div className="text-sm">
              Selected file: <span className="font-medium">{selectedFile.name}</span>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedFile || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Submit for Verification'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
