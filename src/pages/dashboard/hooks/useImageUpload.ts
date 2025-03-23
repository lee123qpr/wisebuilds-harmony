
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { StorageBucket, getActualAvatarBucket } from '@/utils/storage';

interface UseImageUploadProps {
  userId: string;
  namePrefix?: string;
}

export const useImageUpload = ({ userId, namePrefix }: UseImageUploadProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now().toString());
  const [bucketAvailable, setBucketAvailable] = useState<boolean | null>(null);
  const [actualBucketName, setActualBucketName] = useState<string | null>(null);
  const { toast } = useToast();

  // Check bucket on mount
  useEffect(() => {
    const checkBucket = async () => {
      try {
        const bucketName = await getActualAvatarBucket();
        setActualBucketName(bucketName);
        setBucketAvailable(true);
        console.log(`Using avatar bucket: ${bucketName}`);
      } catch (error) {
        console.error('Error checking avatar bucket:', error);
        setBucketAvailable(false);
      }
    };
    
    checkBucket();
  }, []);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) {
      console.log('No file selected or missing userId');
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'No file selected or user ID is missing'
      });
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
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed (jpg, png, etc)');
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit');
      }
      
      // Default to the freelancer-avatar bucket if available
      const bucketToUse = actualBucketName || 'freelancer-avatar';
      console.log(`Attempting upload to ${bucketToUse}/${userId}`);
      
      // Prepare the file path - important for RLS policies
      // The path MUST start with userId for RLS to work properly
      const fileExt = file.name.split('.').pop();
      const fileName = `${namePrefix || 'avatar'}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload directly using Supabase client
      const { data, error } = await supabase.storage
        .from(bucketToUse)
        .upload(filePath, file, { upsert: true });
      
      if (error) {
        console.error('Upload error:', error);
        throw error;
      }
      
      // Get the public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from(bucketToUse)
        .getPublicUrl(filePath);
      
      const url = publicUrlData.publicUrl;
      console.log('Image uploaded successfully, publicUrl:', url);
      
      setImageUrl(url);
      setImageKey(uuidv4()); // Force re-render of Avatar
      
      toast({
        title: 'Image Uploaded',
        description: 'Your profile image has been updated.',
      });
      
      return url;
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
  }, [userId, namePrefix, toast, actualBucketName]);

  return {
    imageUrl,
    uploadingImage,
    imageKey,
    handleImageUpload,
    setImageUrl,
    setUploadingImage,
    bucketAvailable,
    actualBucketName
  };
};
