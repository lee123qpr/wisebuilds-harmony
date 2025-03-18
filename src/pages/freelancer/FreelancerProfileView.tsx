
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, MessageSquare, ArrowLeft, Star, Calendar, Briefcase, MapPin, Mail, Phone, CheckCircle, CheckCircle2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { FreelancerProfile } from '@/types/applications';
import { createConversation } from '@/services/conversations';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const FreelancerProfileView = () => {
  const { freelancerId } = useParams<{ freelancerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['freelancerProfile', freelancerId],
    queryFn: async () => {
      if (!freelancerId) throw new Error('Freelancer ID is required');
      
      const { data, error } = await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('id', freelancerId)
        .single();
        
      if (error) throw error;
      return data as FreelancerProfile;
    },
    enabled: !!freelancerId
  });

  const handleStartChat = async () => {
    try {
      if (!user?.id) {
        throw new Error('Not authenticated');
      }
      
      if (!freelancerId) {
        throw new Error('Freelancer profile not found');
      }
      
      // Check if a conversation exists between this client and freelancer
      const { data: existingConversations, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('freelancer_id', freelancerId)
        .eq('client_id', user.id);
        
      if (checkError) throw checkError;
      
      // If conversation exists, navigate to it
      if (existingConversations && existingConversations.length > 0) {
        // Navigate to the business messages tab with the conversation selected
        navigate(`/dashboard/business?tab=messages&conversation=${existingConversations[0].id}`);
      } else {
        // Create new conversation (without project ID)
        const newConversation = await createConversation(freelancerId, user.id);
        
        if (!newConversation) {
          throw new Error('Failed to create conversation');
        }
        
        // Navigate to the business messages tab with the new conversation selected
        navigate(`/dashboard/business?tab=messages&conversation=${newConversation.id}`);
      }
    } catch (error: any) {
      console.error('Error starting chat:', error);
      toast({
        title: 'Error starting chat',
        description: error.message || 'Failed to start conversation',
        variant: 'destructive',
      });
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'AF';
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
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    // Half star
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
    
    // Empty stars
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

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error || !profile) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Freelancer not found</h1>
            <p className="text-muted-foreground mb-6">We couldn't find the freelancer profile you're looking for.</p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={profile.profile_photo} alt={profile.display_name} />
                    <AvatarFallback>{getInitials(profile.display_name)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="text-center">
                    <h2 className="text-xl font-bold">{profile.display_name}</h2>
                    <p className="text-muted-foreground">{profile.job_title}</p>
                    {profile.rating && renderRatingStars(profile.rating)}
                  </div>
                  
                  <div className="w-full space-y-3">
                    <Button className="w-full flex items-center gap-2" onClick={handleStartChat}>
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                  </div>
                  
                  <div className="w-full space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Member since {formatMemberSince(profile.member_since)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{profile.jobs_completed || 0} jobs completed</span>
                    </div>
                    
                    {profile.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{profile.location}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full flex flex-col gap-1.5">
                    {profile.email_verified && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1 w-full justify-center py-1">
                        <CheckCircle className="h-3 w-3" />
                        Email Verified
                      </Badge>
                    )}
                    
                    {profile.verified && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 w-full justify-center py-1">
                        <CheckCircle2 className="h-3 w-3" />
                        ID Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-3">
            <Tabs defaultValue="about">
              <TabsList>
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="p-4 bg-white rounded-md mt-4">
                {profile.bio && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Bio</h3>
                    <p className="text-sm">{profile.bio}</p>
                  </div>
                )}
                
                {profile.skills && profile.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.hourly_rate && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Hourly Rate</h4>
                      <p>{profile.hourly_rate}</p>
                    </div>
                  )}
                  
                  {profile.day_rate && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">Day Rate</h4>
                      <p>{profile.day_rate}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="contact" className="p-4 bg-white rounded-md mt-4">
                <div className="space-y-4">
                  {profile.email && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Email</h4>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">{profile.email}</a>
                      </div>
                    </div>
                  )}
                  
                  {profile.phone_number && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Phone</h4>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={`tel:${profile.phone_number}`} className="text-blue-600 hover:underline">{profile.phone_number}</a>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default FreelancerProfileView;
