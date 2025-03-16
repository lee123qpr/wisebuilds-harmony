
import { useState } from 'react';
import { getDocumentSignedUrl } from '../services/verificationService';
import { useToast } from '@/hooks/use-toast';

export const useDocumentPreview = () => {
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const loadDocumentUrl = async (documentPath: string | null) => {
    // Reset the URL first
    setDocumentUrl(null);
    
    // If there's no document path, don't try to get a URL
    if (!documentPath) {
      return;
    }
    
    try {
      const url = await getDocumentSignedUrl(documentPath);
      
      if (!url) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load document. It may have been deleted or is no longer accessible.'
        });
        return;
      }
      
      setDocumentUrl(url);
    } catch (error) {
      console.error('Error loading document:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load document. It may have been deleted or is no longer accessible.'
      });
    }
  };

  return { documentUrl, loadDocumentUrl };
};
