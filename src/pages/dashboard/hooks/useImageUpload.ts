
import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { StorageBucket, uploadFile, checkBucketExists, getActualAvatarBucket } from '@/utils/storage';
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
  const [bucketAvailable, setBucketAvailable] = useState<boolean | null>(null);
  const [actualBucketName, setActualBucketName] = useState<string | null>(null);
  // Used to force re-render of Avatar when image is updated
  const [imageKey, setImageKey] = useState(() => uuidv4());
  
  // Check if avatar bucket exists on component mount
  useEffect(() => {
    async function checkBucket() {
      try {
        // First try to get the actual bucket name that exists
        const bucketName = await getActualAvatarBucket();
        setActualBucketName(bucketName);
        console.log(`Using avatar bucket: ${bucketName}`);
        
        // Then check if that bucket exists
        const exists = await checkBucketExists(bucketName);
        console.log(`Avatar bucket ${bucketName} exists:`, exists);
        setBucketAvailable(exists);
        
        if (!exists) {
          // List available buckets for debugging
          const { data } = await supabase.storage.listBuckets();
          console.log('Available buckets:', data?.map(b => b.name).join(', ') || 'none');
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
      
      // Check if bucket is available
      if (bucketAvailable === false) {
        // Attempt to get a list of available buckets
        const { data: bucketsData } = await supabase.storage.listBuckets();
        const availableBuckets = bucketsData?.map(b => b.name).join(', ') || 'none';
        
        throw new Error(`The avatar storage bucket is not available. 
          Available buckets: ${availableBuckets}. Please contact support.`);
      }
      
      // Get the actual bucket name to use
      const bucketToUse = actualBucketName || await getActualAvatarBucket();
      console.log(`Attempting upload to ${bucketToUse}/${userId}`);
      
      // Use the centralized upload utility with the actual bucket name
      const result = await uploadFile(
        file, 
        userId, 
        bucketToUse
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
  }, [userId, folder, namePrefix, toast, bucketAvailable, actualBucketName]);

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
