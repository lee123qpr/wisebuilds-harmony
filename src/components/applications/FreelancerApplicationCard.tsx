
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, Mail, MapPin, Star, Calendar, CheckCircle2, Briefcase } from 'lucide-react';
import { FreelancerApplication } from '@/types/applications';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createConversation } from '@/services/conversations';

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
  const profile = application.freelancer_profile;
  const applicationDate = format(new Date(application.created_at), 'dd MMM yyyy');
  
  const getInitials = (name?: string) => {
    if (!name) return 'AF';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleStartChat = async () => {
    try {
      // Get current user (client) ID
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      
      const clientId = userData.user?.id;
      if (!clientId) {
        throw new Error('Not authenticated');
      }
      
      // Check if a conversation exists between this client and freelancer for this project
      const { data: existingConversations, error: checkError } = await supabase
        .from('conversations')
        .select('id')
        .eq('project_id', projectId)
        .eq('freelancer_id', profile?.id);
        
      if (checkError) throw checkError;
      
      let conversationId;
      
      if (existingConversations && existingConversations.length > 0) {
        // Conversation exists, use its ID
        conversationId = existingConversations[0].id;
        
        // Navigate to existing conversation
        navigate(`/messages/${conversationId}`);
      } else {
        // Create new conversation using the service
        if (!profile?.id) {
          throw new Error('Freelancer profile not found');
        }
        
        const newConversation = await createConversation(profile.id, clientId, projectId);
        
        if (!newConversation) {
          throw new Error('Failed to create conversation');
        }
        
        // Navigate to the new conversation
        navigate(`/messages/${newConversation.id}`);
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
              <h3 className="text-xl font-semibold">{profile?.display_name || 'Freelancer'}</h3>
              <p className="text-muted-foreground">{profile?.job_title || 'Freelancer'}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {profile?.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {profile.location}
                  </div>
                )}
                
                {profile?.job_title && !profile?.location && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4 mr-1" />
                    {profile.job_title}
                  </div>
                )}
                
                {profile?.rating && (
                  <div className="flex items-center text-sm text-amber-500">
                    <Star className="h-4 w-4 mr-1 fill-amber-500" />
                    {profile.rating.toFixed(1)} ({profile.reviews_count || 0} reviews)
                  </div>
                )}
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-1" />
                  Applied on {applicationDate}
                </div>
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
