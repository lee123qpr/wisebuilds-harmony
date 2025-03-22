
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseLogoUploadProps {
  userId: string;
  companyName: string;
  contactName: string;
}

export const useLogoUpload = ({ userId, companyName, contactName }: UseLogoUploadProps) => {
  const { toast } = useToast();
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [imageKey, setImageKey] = useState(Date.now());

  const uploadLogo = async (file: File) => {
    if (!userId) return;
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/logo.${fileExt}`;
    
    setUploadingLogo(true);
    try {
      console.log('Uploading logo to path:', fileName);
      
      // Check if bucket exists first
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      
      if (bucketsError) {
        console.error('Error checking buckets:', bucketsError);
        throw new Error('Failed to check storage buckets');
      }
      
      const bucketExists = buckets?.some(b => b.name === 'company_logos');
      
      if (!bucketExists) {
        console.error('Bucket "company_logos" does not exist');
        toast({
          title: 'Upload failed',
          description: 'Storage bucket not configured correctly. Please contact support.',
          variant: 'destructive'
        });
        return null;
      }
      
      // Upload the file
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('company_logos')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      console.log('Upload successful:', uploadData);
      
      // Get the public URL
      const { data } = supabase.storage
        .from('company_logos')
        .getPublicUrl(fileName);
      
      // Add a timestamp query parameter to bust cache
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`;
      console.log('Public URL with cache busting:', publicUrl);
      
      setLogoUrl(publicUrl);
      setImageKey(Date.now()); // Update the key to force re-render
      
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('client_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) {
        console.error('Profile check error:', profileError);
        throw profileError;
      }
        
      // Update the profile with the logo URL
      if (existingProfile) {
        const { error: updateError } = await supabase
          .from('client_profiles')
          .update({ logo_url: publicUrl })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Profile update error:', updateError);
          throw updateError;
        }
      } else {
        const { error: insertError } = await supabase
          .from('client_profiles')
          .insert({ 
            id: userId,
            logo_url: publicUrl,
            company_name: companyName || null,
            contact_name: contactName || null
          });
          
        if (insertError) {
          console.error('Profile insert error:', insertError);
          throw insertError;
        }
      }
      
      toast({
        title: 'Logo Uploaded',
        description: 'Your company logo has been uploaded successfully.',
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'There was a problem uploading your logo.',
      });
      return null;
    } finally {
      setUploadingLogo(false);
    }
  };

  // Format the logo URL with cache busting
  const cachedLogoUrl = logoUrl ? `${logoUrl.split('?')[0]}?t=${imageKey}` : null;

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    await uploadLogo(file);
  };

  return {
    logoUrl,
    cachedLogoUrl,
    uploadingLogo,
    imageKey,
    handleLogoUpload,
    setLogoUrl,
    setUploadingLogo
  };
};
