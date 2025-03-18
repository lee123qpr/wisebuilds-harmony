
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseImageUploadProps {
  userId: string;
  folder: string;
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
      
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${namePrefix}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${userId}/${fileName}`;
      
      console.log('Uploading to path:', filePath);
      console.log('Bucket name:', 'freelancer-avatar');
      
      // Directly upload to the new bucket
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
        description: error instanceof Error ? error.message : 'There was an unexpected error uploading your image.',
      });
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
