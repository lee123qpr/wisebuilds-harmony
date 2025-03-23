import { useState, useEffect } from 'react';
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

  useEffect(() => {
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
        }
      } catch (err) {
        console.error('Error in getBuckets:', err);
      }
    };
    
    getBuckets();
  }, []);

  useEffect(() => {
    if (imageUrl) {
      console.log('Syncing image URL to parent:', imageUrl);
      setParentProfileImage(imageUrl);
    }
  }, [imageUrl, setParentProfileImage]);

  useEffect(() => {
    setParentUploadingImage(uploadingImage);
  }, [uploadingImage, setParentUploadingImage]);

  useEffect(() => {
    if (initialProfileImage && !imageUrl) {
      console.log('Initializing local image state with:', initialProfileImage);
      setImageUrl(initialProfileImage);
    }
  }, [initialProfileImage, imageUrl, setImageUrl]);

  useEffect(() => {
    const getUserType = async () => {
      const { data } = await supabase.auth.getUser();
      const type = data.user?.user_metadata?.user_type as string || null;
      setUserType(type);
      console.log('Current user type:', type);
    };
    
    getUserType();
  }, [userId]);

  const handleImageUploadProxy = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Image upload triggered with file:', e.target.files?.[0]?.name);
    
    try {
      setUploadingImage(true);
      
      const result = await handleImageUpload(e);
      
      if (result) {
        console.log('Upload successful, URL:', result);
      } else {
        console.log('Upload did not return a URL');
      }
    } catch (error) {
      console.error('Error in upload proxy:', error);
    }
  };

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
