
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FreelancerApplication } from '@/types/applications';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createConversation } from '@/services/conversations';
import { useAuth } from '@/context/AuthContext';
import { FreelancerAvatar } from './profile/FreelancerAvatar';
import { VerificationBadges } from './badges/VerificationBadges';
import { RatingStars } from './profile/RatingStars';
import { ProfileMeta } from './profile/ProfileMeta';
import { ApplicationMessage } from './profile/ApplicationMessage';
import { ContactInfo } from './contact/ContactInfo';
import { ApplicationActions } from './actions/ApplicationActions';

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
            <FreelancerAvatar
              profilePhoto={profile?.profile_photo}
              displayName={profile?.display_name}
            />
            
            <VerificationBadges
              isEmailVerified={profile?.email_verified}
              isIdVerified={profile?.verified}
            />
          </div>
          
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                <h3 className="text-xl font-semibold">{profile?.display_name || 'Freelancer'}</h3>
                <RatingStars 
                  rating={profile?.rating || 0} 
                  reviewsCount={profile?.reviews_count || 0} 
                />
              </div>
              
              <p className="text-muted-foreground">{profile?.job_title || 'Freelancer'}</p>
              
              <ProfileMeta
                memberSince={profile?.member_since}
                jobsCompleted={profile?.jobs_completed}
                location={profile?.location}
              />
            </div>
            
            <ApplicationMessage message={application.message} />
            
            <ContactInfo
              email={profile?.email}
              phoneNumber={profile?.phone_number}
            />
            
            <ApplicationActions
              onStartChat={handleStartChat}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FreelancerApplicationCard;
