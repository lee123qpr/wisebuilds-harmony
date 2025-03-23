
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useImageUpload } from './useImageUpload';

interface UseProfileImageHandlingProps {
  userId: string;
  initialProfileImage: string | null;
  setParentProfileImage: (url: string) => void;
  setParentUploadingImage: (value: boolean) => void;
}

export const useProfileImageHandling = ({
  userId,
  initialProfileImage,
  setParentProfileImage,
  setParentUploadingImage
}: UseProfileImageHandlingProps) => {
  const [availableBuckets, setAvailableBuckets] = useState<string[]>([]);
  const [userType, setUserType] = useState<string | null>(null);
  const [bucketsLoaded, setBucketsLoaded] = useState(false);

  const {
    imageUrl,
    uploadingImage,
    imageKey,
    handleImageUpload,
    setImageUrl,
    setUploadingImage,
    bucketAvailable,
    actualBucketName
  } = useImageUpload({
    userId,
    namePrefix: 'avatar'
  });

  // Load available buckets only once
  useEffect(() => {
    if (bucketsLoaded) return;
    
    const getBuckets = async () => {
      try {
        const { data, error } = await supabase.storage.listBuckets();
        if (error) {
          console.error('Error listing buckets:', error);
          return;
        }
        
        if (data) {
          const bucketNames = data.map(b => b.name);
          console.log('Available buckets:', bucketNames.join(', '));
          setAvailableBuckets(bucketNames);
          setBucketsLoaded(true);
        }
      } catch (err) {
        console.error('Error in getBuckets:', err);
      }
    };
    
    getBuckets();
  }, [bucketsLoaded]);

  // Sync image URL to parent only when it changes
  useEffect(() => {
    if (imageUrl) {
      setParentProfileImage(imageUrl);
    }
  }, [imageUrl, setParentProfileImage]);

  // Sync uploading state to parent
  useEffect(() => {
    setParentUploadingImage(uploadingImage);
  }, [uploadingImage, setParentUploadingImage]);

  // Initialize local image state with profile image
  useEffect(() => {
    if (initialProfileImage && !imageUrl) {
      setImageUrl(initialProfileImage);
    }
  }, [initialProfileImage, imageUrl, setImageUrl]);

  // Get user type only once
  useEffect(() => {
    if (userType !== null) return;
    
    const getUserType = async () => {
      const { data } = await supabase.auth.getUser();
      const type = data.user?.user_metadata?.user_type as string || null;
      setUserType(type);
    };
    
    getUserType();
  }, [userType]);

  // Memoize upload handler to prevent recreating on each render
  // Updated to return void instead of string
  const handleImageUploadProxy = useCallback(async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      setUploadingImage(true);
      await handleImageUpload(e); // Just await, don't return the string value
    } catch (error) {
      console.error('Error in upload proxy:', error);
    }
  }, [handleImageUpload, setUploadingImage]);

  return {
    imageUrl,
    uploadingImage,
    imageKey,
    handleImageUploadProxy,
    bucketAvailable,
    actualBucketName,
    availableBuckets,
    userType
  };
};
