
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Project } from '@/components/projects/useProjects';
import ProjectDescription from './ProjectDescription';
import ProjectMetadata from './ProjectMetadata';
import ProjectRequirements from './ProjectRequirements';
import { usePurchaseLead } from '@/hooks/usePurchaseLead';
import { useAuth } from '@/context/AuthContext';
import { useCredits } from '@/hooks/useCredits';
import { Loader2, Phone, Mail } from 'lucide-react';
import ClientContactInfo from './ClientContactInfo';
import { supabase } from '@/integrations/supabase/client';

interface ProjectDetailsProps {
  project: Project;
}

const ProjectDetails = ({ project }: ProjectDetailsProps) => {
  const [hasBeenPurchased, setHasBeenPurchased] = useState(false);
  const { purchaseLead, isPurchasing } = usePurchaseLead();
  const { user } = useAuth();
  const { creditBalance, isLoadingBalance } = useCredits();
  const isFreelancer = user?.user_metadata?.user_type === 'freelancer';

  const handlePurchaseLead = async () => {
    const success = await purchaseLead(project.id);
    if (success) {
      setHasBeenPurchased(true);
    }
  };

  const checkIfAlreadyPurchased = async () => {
    if (!user) return;
    
    const { data } = await supabase.rpc('check_application_exists', {
      p_project_id: project.id,
      p_user_id: user.id
    });
    
    if (data) {
      setHasBeenPurchased(true);
    }
  };

  // Check if the project has already been purchased when component mounts
  useEffect(() => {
    checkIfAlreadyPurchased();
  }, [project.id, user]);

  // Determine if the purchase button should be disabled
  const isPurchaseDisabled = 
    isPurchasing || 
    isLoadingBalance || 
    (typeof creditBalance === 'number' && creditBalance < 1);

  return (
    <Card>
      <CardHeader>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">Project Details</h2>
          <p className="text-muted-foreground">All information about this project</p>
        </div>
        <div className="flex justify-between items-start">
          <CardTitle>{project.title}</CardTitle>
          {isFreelancer && !hasBeenPurchased && (
            <Button 
              onClick={handlePurchaseLead} 
              disabled={isPurchaseDisabled}
              className="flex items-center gap-2"
            >
              {isPurchasing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Purchase Lead (1 Credit)
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasBeenPurchased && (
          <>
            <ClientContactInfo projectId={project.id} />
            <Separator />
          </>
        )}
        
        <ProjectDescription description={project.description} />
        
        <Separator />
        
        <ProjectMetadata
          created_at={project.created_at}
          start_date={project.start_date}
          role={project.role}
          budget={project.budget}
          duration={project.duration}
          location={project.location}
          work_type={project.work_type}
        />
        
        <Separator />
        
        <ProjectRequirements
          requires_insurance={project.requires_insurance}
          requires_equipment={project.requires_equipment}
          requires_site_visits={project.requires_site_visits}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
