
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { uploadFile, checkBucketExists, getActualAvatarBucket } from '@/utils/storage';
import { supabase } from '@/integrations/supabase/client';
import { getAvatarBucketName } from '@/hooks/verification/services/storage-utils';

interface UseImageUploadProps {
  userId: string;
  folder?: string; // Optional subfolder
  namePrefix?: string; // Optional name prefix for the file
}

export const useImageUpload = ({ userId, folder, namePrefix }: UseImageUploadProps) => {
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [bucketAvailable, setBucketAvailable] = useState<boolean | null>(null);
  const [actualBucketName, setActualBucketName] = useState<string | null>(null);
  // Used to force re-render of Avatar when image is updated
  const [imageKey, setImageKey] = useState(() => uuidv4());
  
  // Check if avatar bucket exists on component mount
  useEffect(() => {
    async function checkBucket() {
      try {
        // Get available buckets
        const { data: bucketsData } = await supabase.storage.listBuckets();
        const availableBucketsStr = bucketsData?.map(b => b.name).join(', ') || 'none';
        console.log(`Available buckets: ${availableBucketsStr}`);
        
        if (!bucketsData || bucketsData.length === 0) {
          console.error('No buckets found in storage');
          setBucketAvailable(false);
          return;
        }
        
        // Try to get the avatar bucket name
        const bucketName = await getAvatarBucketName();
        
        if (bucketName) {
          setActualBucketName(bucketName);
          console.log(`Using avatar bucket: ${bucketName}`);
          setBucketAvailable(true);
        } else {
          // Use the first available bucket as fallback
          if (bucketsData.length > 0) {
            const fallbackBucket = bucketsData[0].name;
            setActualBucketName(fallbackBucket);
            console.log(`Falling back to first available bucket: ${fallbackBucket}`);
            setBucketAvailable(true);
          } else {
            setBucketAvailable(false);
          }
        }
      } catch (error) {
        console.error('Error checking avatar bucket:', error);
        setBucketAvailable(false);
      }
    }
    
    if (userId) {
      checkBucket();
    }
  }, [userId]);

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
      
      // Check if we have a bucket to use
      if (!actualBucketName) {
        // Try to get an available bucket again (just in case)
        const bucketName = await getAvatarBucketName();
        
        if (!bucketName) {
          const { data: buckets } = await supabase.storage.listBuckets();
          const availableBuckets = buckets?.map(b => b.name).join(', ') || 'none';
          
          throw new Error(`No available storage bucket found for avatar uploads. 
            Available buckets: ${availableBuckets}. Please contact support.`);
        }
        
        setActualBucketName(bucketName);
      }
      
      const bucketToUse = actualBucketName!;
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
  }, [userId, folder, namePrefix, toast, actualBucketName]);

  return {
    imageUrl,
    setImageUrl,
    uploadingImage,
    setUploadingImage,
    imageKey,
    bucketAvailable,
    actualBucketName,
    handleImageUpload
  };
};
