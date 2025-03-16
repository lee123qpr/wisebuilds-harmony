
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Mail, MapPin, Star, Calendar, CheckCircle2, Briefcase, Building } from 'lucide-react';
import { FreelancerApplication } from '@/types/applications';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createConversation } from '@/services/conversations';
import { useAuth } from '@/context/AuthContext';

interface FreelancerApplicationCardProps {
  application: FreelancerApplication;
  projectId: string;
}

const FreelancerApplicationCard: React.FC<FreelancerApplicationCardProps> = ({ 
  application, 
  projectId 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const profile = application.freelancer_profile;
  const applicationDate = format(new Date(application.created_at), 'dd MMM yyyy');
  
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

  const handleStartChat = async () => {
    try {
      // Get current user (client) ID
      const clientId = user?.id;
      if (!clientId) {
        throw new Error('Not authenticated');
      }
      
      if (!profile?.id) {
        throw new Error('Freelancer profile not found');
      }
      
      console.log('Starting chat between client', clientId, 'and freelancer', profile.id, 'for project', projectId);
      
      // Check if a conversation exists between this client and freelancer for this project
      const { data: existingConversations, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('project_id', projectId)
        .eq('freelancer_id', profile.id)
        .eq('client_id', clientId);
        
      if (checkError) throw checkError;
      
      // If conversation exists, navigate to it
      if (existingConversations && existingConversations.length > 0) {
        console.log('Using existing conversation:', existingConversations[0].id);
        // Navigate to the business messages tab with the conversation selected
        navigate(`/dashboard/business?tab=messages&conversation=${existingConversations[0].id}`);
      } else {
        // Create new conversation
        console.log('Creating new conversation between client', clientId, 'and freelancer', profile.id);
        const newConversation = await createConversation(profile.id, clientId, projectId);
        
        if (!newConversation) {
          throw new Error('Failed to create conversation');
        }
        
        console.log('Created new conversation:', newConversation.id);
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

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.profile_photo} alt={profile?.display_name} />
              <AvatarFallback>{getInitials(profile?.display_name)}</AvatarFallback>
            </Avatar>
            
            {profile?.verified && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <h3 className="text-xl font-semibold">{profile?.display_name || 'Freelancer'}</h3>
                {profile?.rating && renderRatingStars(profile.rating)}
              </div>
              
              <p className="text-muted-foreground">{profile?.job_title || 'Freelancer'}</p>
              
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
                  Member since {formatMemberSince(profile?.member_since)}
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Briefcase className="h-4 w-4 mr-1.5 flex-shrink-0" />
                  {profile?.jobs_completed || 0} jobs completed
                </div>
                
                {profile?.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    {profile.location}
                  </div>
                )}
              </div>
            </div>
            
            {application.message && (
              <div className="bg-slate-50 p-4 rounded-md">
                <p className="font-medium mb-1">Application message:</p>
                <p className="text-sm">{application.message}</p>
              </div>
            )}
            
            <div>
              <p className="font-medium mb-2">Contact information:</p>
              <div className="space-y-2">
                {profile?.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`mailto:${profile.email}`} className="text-sm text-blue-600 hover:underline">{profile.email}</a>
                  </div>
                )}
                
                {profile?.phone_number && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={`tel:${profile.phone_number}`} className="text-sm text-blue-600 hover:underline">{profile.phone_number}</a>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Button 
                onClick={handleStartChat}
                className="flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Message now
              </Button>
              
              <Button variant="outline">View full profile</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerApplicationCard;
