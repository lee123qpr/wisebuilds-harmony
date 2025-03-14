
import React from 'react';
import { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CompanyLogoProps {
  logoUrl: string | null;
  uploadingLogo: boolean;
  setUploadingLogo: (value: boolean) => void;
  setLogoUrl: (url: string) => void;
  companyName: string;
  contactName: string;
  userId: string;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  uploadingLogo,
  setUploadingLogo,
  setLogoUrl,
  companyName,
  contactName,
  userId
}) => {
  const { toast } = useToast();

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/logo.${fileExt}`;
    const filePath = `${fileName}`;
    
    setUploadingLogo(true);
    try {
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('company_logos')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('company_logos')
        .getPublicUrl(filePath);
      
      const publicUrl = data.publicUrl;
      setLogoUrl(publicUrl);
      
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('client_profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle();
        
      // Update the profile with the logo URL
      if (existingProfile) {
        await supabase
          .from('client_profiles')
          .update({ logo_url: publicUrl })
          .eq('id', userId);
      } else {
        await supabase
          .from('client_profiles')
          .insert({ 
            id: userId,
            logo_url: publicUrl 
          });
      }
      
      toast({
        title: 'Logo Uploaded',
        description: 'Your company logo has been uploaded successfully.',
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'There was a problem uploading your logo.',
      });
    } finally {
      setUploadingLogo(false);
    }
  };

  // Generate initials for avatar fallback
  const getInitials = () => {
    if (!companyName) return 'BC'; // Default: Business Client
    
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4 group">
            <Avatar className="h-32 w-32 border-2 border-primary/10">
              {logoUrl ? (
                <AvatarImage src={logoUrl} alt="Company logo" />
              ) : null}
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <label className="cursor-pointer p-2">
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                />
                {uploadingLogo ? (
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                ) : (
                  <Upload className="h-6 w-6 text-white" />
                )}
              </label>
            </div>
          </div>
          <h2 className="text-xl font-semibold mt-2">{companyName || 'Your Company'}</h2>
          <p className="text-sm text-muted-foreground">{contactName || 'Contact Person'}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyLogo;
