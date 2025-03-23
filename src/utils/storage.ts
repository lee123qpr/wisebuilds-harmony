
/**
 * Gets the actual bucket name to use for avatars based on available buckets
 */
export const getActualAvatarBucket = async (): Promise<string> => {
  try {
    // Check available buckets
    const { data: bucketsData, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return StorageBucket.AVATARS; // Return default as fallback
    }
    
    console.log('Available buckets:', bucketsData?.map(b => b.name).join(', '));
    
    // Check possible avatar bucket names in order of preference
    const possibleBucketNames = [
      'freelancer-avatar',  // First choice - updated to match existing bucket
      'avatar',             // Second choice
      'avatars',            // Third choice
      'profile-images',     // Fourth choice
      'user-avatars'        // Fifth choice
    ];
    
    // Return the first bucket that exists
    for (const bucketName of possibleBucketNames) {
      if (bucketsData?.some(b => b.name === bucketName)) {
        console.log(`Found avatar bucket: ${bucketName}`);
        return bucketName;
      }
    }
    
    // If no avatar bucket found, log and return the first one as an attempt
    console.warn('No avatar bucket found, defaulting to first bucket in list');
    if (bucketsData && bucketsData.length > 0) {
      return bucketsData[0].name;
    }
    
    // Last resort, return the default value
    return StorageBucket.AVATARS;
    
  } catch (error) {
    console.error('Error getting avatar bucket:', error);
    return StorageBucket.AVATARS; // Return default as fallback
  }
};
