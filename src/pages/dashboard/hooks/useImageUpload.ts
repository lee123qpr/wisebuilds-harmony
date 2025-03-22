
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { isUserFreelancer } from '@/hooks/verification/services/user-verification';

interface UseImageUploadProps {
  userId: string;
  folder: string; // Keeping this for backward compatibility, but it's no longer used
  namePrefix: string;
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
      return;
    }

    try {
      setUploadingImage(true);
      console.log('Uploading image for user:', userId);
      console.log('File details:', { name: file.name, type: file.type, size: file.size });
      
      // Create unique file name with proper extension
      const fileExt = file.name.split('.').pop();
      const fileName = `${namePrefix.trim() || 'profile'}-${Date.now()}.${fileExt}`;
      
      // Important: The path MUST start with the userId for RLS policies to work
      const filePath = `${userId}/${fileName}`;
      
      console.log('Uploading to path:', filePath);
      
      // First check if we can access the bucket - this helps diagnose permission issues
      const { data: bucketInfo, error: bucketError } = await supabase.storage
        .getBucket('freelancer-avatar');
        
      if (bucketError) {
        console.error('Error accessing bucket:', bucketError);
        throw new Error(`Cannot access storage bucket: ${bucketError.message}`);
      }
      
      console.log('Bucket exists and is accessible:', bucketInfo);
      
      // Upload to freelancer-avatar bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('freelancer-avatar')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Error during upload:', uploadError);
        
        // Handle specific storage error cases
        if (uploadError.message.includes('storage/object-not-found')) {
          throw new Error('Storage bucket not found. Please contact support.');
        } else if (uploadError.message.includes('storage/permission-denied') || uploadError.status === 403) {
          throw new Error('Permission denied. Make sure your account has correct permissions.');
        } else {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
      }

      if (!uploadData) {
        console.error('Upload completed but no data returned');
        throw new Error('Upload completed but no file data was returned');
      }

      console.log('Upload successful, getting public URL for path:', filePath);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('freelancer-avatar')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully, publicUrl:', publicUrl);
      
      setImageUrl(publicUrl);
      setImageKey(uuidv4()); // Force re-render of Avatar
      
      toast({
        title: 'Image Uploaded',
        description: 'Your profile image has been updated.',
      });
      
      // Return the URL for use in updating profile if needed
      return publicUrl;
      
    } catch (error) {
      console.error('Error in image upload process:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error instanceof Error 
          ? error.message 
          : 'There was an error uploading your image. Please verify your account type and permissions.',
      });
      return null;
    } finally {
      setUploadingImage(false);
    }
  }, [userId, namePrefix, toast]);

  return {
    imageUrl,
    setImageUrl,
    uploadingImage,
    setUploadingImage,
    imageKey,
    handleImageUpload
  };
};
