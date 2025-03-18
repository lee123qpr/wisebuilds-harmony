
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
      
      // First verify bucket exists before attempting upload
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error listing buckets:', bucketsError);
        toast({
          variant: 'destructive',
          title: 'Storage Error',
          description: 'Could not access storage. Please try again later.',
        });
        return;
      }
      
      const userUploadsBucket = buckets?.find(bucket => bucket.id === 'user-uploads');
      
      if (!userUploadsBucket) {
        console.error('user-uploads bucket does not exist');
        toast({
          variant: 'destructive',
          title: 'Storage Setup Error',
          description: 'The storage location for uploads is not configured properly. Please contact support.',
        });
        return;
      }
      
      console.log('Bucket found, attempting to upload');
      
      // Upload the file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error('Error during upload:', uploadError);
        
        if (uploadError.message.includes('bucket') || uploadError.message.includes('storage')) {
          console.error('Bucket-related error:', uploadError.message);
          toast({
            variant: 'destructive',
            title: 'Storage Error',
            description: 'The storage location for uploads is not configured properly. Please contact support.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Upload Failed',
            description: 'There was an error uploading your image: ' + uploadError.message,
          });
        }
        return;
      }

      if (!uploadData) {
        console.error('Upload completed but no data returned');
        toast({
          variant: 'destructive',
          title: 'Upload Issue',
          description: 'Upload completed but we couldn\'t get the image URL. Please try again.',
        });
        return;
      }

      console.log('Upload successful, getting public URL for path:', filePath);
      
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
      console.error('Error in image upload process:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'There was an unexpected error uploading your image.',
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
