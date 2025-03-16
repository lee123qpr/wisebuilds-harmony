
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { useFreelancerProfile } from './hooks/useFreelancerProfile';
import FreelancerProfileForm from './components/profile/FreelancerProfileForm';
import { Skeleton } from '@/components/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { freelancerProfileSchema, FreelancerProfileFormValues } from './components/profile/freelancerSchema';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

const FreelancerProfile = () => {
  const { user } = useAuth();
  const { profile, isLoadingProfile, saveProfile, isSaving } = useFreelancerProfile();

  const form = useForm<FreelancerProfileFormValues>({
    resolver: zodResolver(freelancerProfileSchema),
    defaultValues: {
      fullName: '',
      profession: '',
      location: '',
      bio: '',
      phoneNumber: '',
      website: '',
      hourlyRate: '',
      availability: '',
      skills: [],
      experience: '',
      qualifications: [],
      accreditations: [],
      indemnityInsurance: { hasInsurance: false, coverLevel: '' },
      previousWork: [],
      previousEmployers: [],
      idVerified: false
    }
  });

  // When profile is loaded, set form values
  React.useEffect(() => {
    if (profile) {
      form.reset({
        fullName: `${profile.first_name} ${profile.last_name}`.trim(),
        profession: profile.job_title || '',
        location: profile.location || '',
        bio: profile.bio || '',
        phoneNumber: profile.phone_number || '',
        website: profile.website || '',
        hourlyRate: profile.hourly_rate || '',
        availability: profile.availability || '',
        skills: profile.skills || [],
        experience: profile.experience || '',
        qualifications: profile.qualifications || [],
        accreditations: profile.accreditations || [],
        indemnityInsurance: { 
          hasInsurance: profile.has_indemnity_insurance || false, 
          coverLevel: profile.indemnity_insurance?.coverLevel || ''
        },
        previousWork: profile.previous_work || [],
        previousEmployers: profile.previous_employers || [],
        idVerified: profile.id_verified || false
      });
    }
  }, [profile, form]);

  const handleSubmit = async (values: FreelancerProfileFormValues) => {
    // Split fullName into first and last name
    const nameParts = values.fullName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    // Transform form values to profile data format
    const profileData = {
      first_name: firstName,
      last_name: lastName,
      display_name: values.fullName,
      job_title: values.profession,
      location: values.location,
      bio: values.bio,
      email: profile?.email || null,
      phone_number: values.phoneNumber,
      website: values.website,
      hourly_rate: values.hourlyRate,
      availability: values.availability,
      skills: values.skills,
      experience: values.experience,
      qualifications: values.qualifications,
      accreditations: values.accreditations,
      has_indemnity_insurance: values.indemnityInsurance.hasInsurance,
      indemnity_insurance: values.indemnityInsurance.hasInsurance ? values.indemnityInsurance : null,
      previous_work: values.previousWork,
      previous_employers: values.previousEmployers,
      profile_photo: profile?.profile_photo || null,
      member_since: profile?.member_since || null,
      jobs_completed: profile?.jobs_completed || 0,
      id_verified: values.idVerified
    };
    
    await saveProfile(profileData);
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Freelancer Profile</CardTitle>
          <CardDescription>You must be logged in to view your profile.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please log in to continue.</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-80 mb-2" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Freelancer Profile</CardTitle>
          <CardDescription>Update your profile information here.</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FreelancerProfileForm form={form} />
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FreelancerProfile;
