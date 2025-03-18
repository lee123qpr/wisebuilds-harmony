
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
      
      // Create unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${namePrefix}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${userId}/${fileName}`;
      
      console.log('Uploading to path:', filePath);
      
      // Check if the user-uploads bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const userUploadsBucketExists = buckets?.some(bucket => bucket.name === 'user-uploads');
      
      if (!userUploadsBucketExists) {
        console.error('user-uploads bucket does not exist');
        toast({
          variant: 'destructive',
          title: 'Storage Error',
          description: 'The storage location for uploads is not configured properly.',
        });
        setUploadingImage(false);
        return;
      }
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error during upload:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, getting public URL');
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);

      console.log('Image uploaded successfully, publicUrl:', publicUrl);
      
      setImageUrl(publicUrl);
      setImageKey(uuidv4()); // Force re-render of Avatar
      
      toast({
        title: 'Image Uploaded',
        description: 'Your profile image has been updated.',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'There was an error uploading your image.',
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
