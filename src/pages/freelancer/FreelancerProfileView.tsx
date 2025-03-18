
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Calendar, CheckCircle, CheckCircle2, Mail, MapPin, Phone, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO } from 'date-fns';
import { FreelancerProfile } from '@/types/applications';

const FreelancerProfileView: React.FC = () => {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<FreelancerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      if (!freelancerId) return;
      
      setIsLoading(true);
      try {
        // Get user data via edge function
        const { data: userData, error: userError } = await supabase.functions.invoke(
          'get-user-profile',
          {
            body: { userId: freelancerId }
          }
        );
        
        if (userError) throw userError;
        
        // Get verification status
        const { data: verificationData, error: verificationError } = await supabase
          .rpc('is_user_verified', { user_id: freelancerId });
        
        if (verificationError) {
          console.error('Error checking verification status:', verificationError);
        }
        
        // Extract user metadata
        const userMetadata = userData?.user_metadata || {};
        const email = userData?.email || '';
        const firstName = userMetadata.first_name || userMetadata.firstname || '';
        const lastName = userMetadata.last_name || userMetadata.lastname || '';
        const phoneNumber = userMetadata.phone_number || userMetadata.phone || '';
        const displayName = firstName && lastName 
          ? `${firstName} ${lastName}` 
          : userMetadata.full_name || 'Anonymous Freelancer';
        const jobTitle = userMetadata.job_title || userMetadata.profession || '';
        const location = userMetadata.location || '';
        const bio = userMetadata.bio || '';
        const skills = userMetadata.skills || [];
        
        // Get any reviews for this user
        const { data: reviews, error: reviewsError } = await supabase
          .from('client_reviews')
          .select('rating')
          .eq('reviewer_id', freelancerId);
        
        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        }
        
        // Calculate average rating
        let rating = null;
        if (reviews && reviews.length > 0) {
          const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
          rating = sum / reviews.length;
        }
        
        setProfile({
          id: freelancerId,
          email: email,
          verified: verificationData || false,
          email_verified: userData?.email_confirmed || false,
          first_name: firstName,
          last_name: lastName,
          display_name: displayName,
          phone_number: phoneNumber,
          job_title: jobTitle,
          location: location,
          bio: bio,
          skills: skills,
          profile_photo: userMetadata.avatar_url,
          rating: rating,
          reviews_count: reviews?.length || 0,
          member_since: userData?.user?.created_at || userMetadata.created_at,
          jobs_completed: userMetadata.jobs_completed || 0
        });
      } catch (error: any) {
        console.error('Error fetching freelancer profile:', error);
        toast({
          title: 'Error loading profile',
          description: error.message || 'Could not load freelancer profile',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFreelancerProfile();
  }, [freelancerId, toast]);

  const getInitials = (name?: string) => {
    if (!name) return 'FL';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const formatMemberSince = (dateString?: string) => {
    if (!dateString) return 'Recently joined';
    try {
      return format(parseISO(dateString), 'MMMM yyyy');
    } catch (e) {
      return 'Recently joined';
    }
  };

  const renderRatingStars = (rating?: number) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }
    
    return (
      <div className="flex items-center gap-1">
        <div className="flex">{stars}</div>
        <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
        <span className="text-sm text-muted-foreground">
          ({profile?.reviews_count || 0})
        </span>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Freelancer Profile</h1>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1 space-y-4">
                  <div>
                    <Skeleton className="h-7 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-2" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full" />
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-full max-w-md mb-1" />
                    <Skeleton className="h-4 w-full max-w-md" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : !profile ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p>Profile not found or could not be loaded.</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.profile_photo} alt={profile.display_name} />
                    <AvatarFallback>{getInitials(profile.display_name)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col items-center gap-1">
                    {profile.email_verified && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Email Verified
                      </Badge>
                    )}
                    
                    {profile.verified && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        ID Verified
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                      <h2 className="text-xl font-semibold">{profile.display_name || 'Freelancer'}</h2>
                      {profile.rating && renderRatingStars(profile.rating)}
                    </div>
                    
                    <p className="text-muted-foreground">{profile.job_title || 'Freelancer'}</p>
                    
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        Member since {formatMemberSince(profile.member_since)}
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4 mr-1.5 flex-shrink-0" />
                        {profile.jobs_completed || 0} jobs completed
                      </div>
                      
                      {profile.location && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                          {profile.location}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <div className="bg-slate-50 p-4 rounded-md">
                      <p className="font-medium mb-1">Bio:</p>
                      <p className="text-sm">{profile.bio}</p>
                    </div>
                  )}
                  
                  {profile.skills && profile.skills.length > 0 && (
                    <div>
                      <p className="font-medium mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="font-medium mb-2">Contact information:</p>
                    <div className="space-y-2">
                      {profile.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={`mailto:${profile.email}`} className="text-sm text-blue-600 hover:underline">{profile.email}</a>
                        </div>
                      )}
                      
                      {profile.phone_number && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <a href={`tel:${profile.phone_number}`} className="text-sm text-blue-600 hover:underline">{profile.phone_number}</a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default FreelancerProfileView;
