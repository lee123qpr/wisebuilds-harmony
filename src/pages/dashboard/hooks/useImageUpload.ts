
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { StorageBucket, uploadFile } from '@/utils/storage';
import { supabase } from '@/integrations/supabase/client';

interface UseImageUploadProps {
  userId: string;
  folder?: string; // Optional subfolder
  namePrefix?: string; // Optional name prefix for the file
}

export const useImageUpload = ({ userId, folder, namePrefix }: UseImageUploadProps) => {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  // Used to force re-render of Avatar when image is updated
  const [imageKey, setImageKey] = useState(() => uuidv4());

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) {
      console.log('No file selected or missing userId');
      return null;
    }

    try {
      setUploadingImage(true);
      console.log('Uploading image for user:', userId);
      console.log('File details:', { name: file.name, type: file.type, size: file.size });
      
      // Verify user is authenticated before attempting upload
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Authentication required: Please log in before uploading');
      }
      
      // Use the centralized upload utility with the correct bucket name
      const result = await uploadFile(
        file, 
        userId, 
        StorageBucket.AVATARS, // Use the AVATARS constant which maps to "freelancer-avatars"
        folder || (namePrefix ? namePrefix.toLowerCase() : 'avatar')
      );
      
      if (!result) {
        throw new Error('Upload failed. Please try again.');
      }
      
      console.log('Image uploaded successfully, publicUrl:', result.url);
      
      setImageUrl(result.url);
      setImageKey(uuidv4()); // Force re-render of Avatar
      
      toast({
        title: 'Image Uploaded',
        description: 'Your profile image has been updated.',
      });
      
      // Return the URL for use in updating profile if needed
      return result.url;
      
    } catch (error) {
      console.error('Error in image upload process:', error);
      
      // Handle different error types
      let errorMessage = 'There was an error uploading your image.';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: errorMessage
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  }, [userId, folder, namePrefix, toast]);

  return {
    imageUrl,
    setImageUrl,
    uploadingImage,
    setUploadingImage,
    imageKey,
    handleImageUpload
  };
};
