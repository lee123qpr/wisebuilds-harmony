
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Upload, CheckCircle2, Calendar, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface CompanyLogoProps {
  logoUrl: string | null;
  uploadingLogo: boolean;
  setUploadingLogo: (value: boolean) => void;
  setLogoUrl: (url: string) => void;
  companyName: string;
  contactName: string;
  userId: string;
  memberSince: string | null;
  emailVerified: boolean;
  jobsCompleted: number;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  uploadingLogo,
  setUploadingLogo,
  setLogoUrl,
  companyName,
  contactName,
  userId,
  memberSince,
  emailVerified,
  jobsCompleted
}) => {
  const { toast } = useToast();
  const [imageKey, setImageKey] = useState(Date.now());

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/logo.${fileExt}`;
    
    setUploadingLogo(true);
    try {
      console.log('Uploading logo to path:', fileName);
      
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

  // Format the member since date
  const formattedMemberSince = memberSince 
    ? format(new Date(memberSince), 'MMMM yyyy')
    : 'Recently joined';

  // Add a cache-busting parameter to the logo URL
  const cachedLogoUrl = logoUrl ? `${logoUrl.split('?')[0]}?t=${imageKey}` : null;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          <div className="relative mb-4 group">
            <Avatar className="h-32 w-32 border-2 border-primary/10">
              {cachedLogoUrl ? (
                <AvatarImage key={imageKey} src={cachedLogoUrl} alt="Company logo" />
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
          <p className="text-sm text-muted-foreground mb-4">{contactName || 'Contact Person'}</p>

          <div className="flex items-center justify-center gap-2 mb-2">
            {emailVerified ? (
              <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1 bg-amber-50 text-amber-700 border-amber-200">
                Verification Pending
              </Badge>
            )}
          </div>

          <div className="w-full space-y-2 mt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Member since {formattedMemberSince}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{jobsCompleted} {jobsCompleted === 1 ? 'job' : 'jobs'} completed</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyLogo;
