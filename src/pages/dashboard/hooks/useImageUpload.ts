
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
      
      // Check if user is a freelancer
      const isFreelancer = await isUserFreelancer();
      
      if (!isFreelancer) {
        console.error('User is not a freelancer. Upload will likely fail due to RLS policies.');
        toast({
          variant: 'destructive',
          title: 'Permission Error',
          description: 'Only freelancer accounts can upload profile images. Your account is not set as a freelancer type.',
        });
        return;
      }
      
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${namePrefix.trim() || 'profile'}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`; // Only use userId in the path to comply with RLS policy
      
      console.log('Uploading to path:', filePath);
      console.log('Bucket name:', 'freelancer-avatar');
      
      // Upload to freelancer-avatar bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('freelancer-avatar')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600'
        });

      if (uploadError) {
        console.error('Error during upload:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
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
    } catch (error) {
      console.error('Error in image upload process:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: error instanceof Error 
          ? error.message 
          : 'There was an error uploading your image. Make sure you have a freelancer account with proper permissions.',
      });
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
