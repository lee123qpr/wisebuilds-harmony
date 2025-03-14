
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Form } from '@/components/ui/form';
import { Loader2, Save, Upload } from 'lucide-react';
import ProfileForm from './components/profile/ProfileForm';
import ReviewsList from './components/profile/ReviewsList';
import { clientProfileSchema } from './components/profile/schema';

type ClientProfileFormValues = z.infer<typeof clientProfileSchema>;

const ClientProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  const form = useForm<ClientProfileFormValues>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      companyAddress: '',
      companyDescription: '',
      phoneNumber: '',
      website: '',
    },
  });

  // Fetch client profile data
  useEffect(() => {
    async function getProfileData() {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('client_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          // Populate form with existing data
          form.reset({
            companyName: data.company_name || '',
            contactName: data.contact_name || '',
            companyAddress: data.company_address || '',
            companyDescription: data.company_description || '',
            phoneNumber: data.phone_number || '',
            website: data.website || '',
          });
          
          setLogoUrl(data.logo_url);
        } else {
          // Create initial profile with data from auth.user metadata
          const companyName = user.user_metadata?.company_name || '';
          const contactName = user.user_metadata?.contact_name || '';
          const phoneNumber = user.user_metadata?.phone || '';
          const companyAddress = user.user_metadata?.company_address || '';
          const companyDescription = user.user_metadata?.company_description || '';
          
          form.reset({
            companyName,
            contactName,
            companyAddress,
            companyDescription,
            phoneNumber,
            website: '',
          });
          
          // Insert initial profile
          if (companyName || contactName) {
            await supabase.from('client_profiles').insert({
              id: user.id,
              company_name: companyName,
              contact_name: contactName,
              phone_number: phoneNumber,
              company_address: companyAddress,
              company_description: companyDescription,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load profile information.',
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    getProfileData();
  }, [user, form, toast]);

  const onSubmit = async (values: ClientProfileFormValues) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('client_profiles')
        .upsert({
          id: user.id,
          company_name: values.companyName,
          contact_name: values.contactName,
          company_address: values.companyAddress,
          company_description: values.companyDescription,
          phone_number: values.phoneNumber,
          website: values.website,
          logo_url: logoUrl,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save profile information.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-logo.${fileExt}`;
    const filePath = `company_logos/${fileName}`;
    
    setUploadingLogo(true);
    try {
      // Check if storage bucket exists, if not create it
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'company_logos');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('company_logos', {
          public: true,
        });
      }
      
      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('company_logos')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('company_logos')
        .getPublicUrl(filePath);
      
      setLogoUrl(data.publicUrl);
      
      // Update the profile with the logo URL
      await supabase
        .from('client_profiles')
        .update({ logo_url: data.publicUrl })
        .eq('id', user.id);
      
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
    const companyName = form.watch('companyName');
    if (!companyName) return 'BC'; // Default: Business Client
    
    return companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Company Profile</h1>
            <p className="text-muted-foreground">Manage your business information and reviews</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
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
                  <h2 className="text-xl font-semibold mt-2">{form.watch('companyName') || 'Your Company'}</h2>
                  <p className="text-sm text-muted-foreground">{form.watch('contactName') || 'Contact Person'}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                    <CardDescription>
                      Update your company details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <ProfileForm form={form} />
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving
                              </>
                            ) : (
                              <>
                                <Save className="mr-2 h-4 w-4" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Client Reviews</CardTitle>
                    <CardDescription>
                      Reviews from freelancers who have worked with you
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReviewsList userId={user?.id || ''} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClientProfile;
