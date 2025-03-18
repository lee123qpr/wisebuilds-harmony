
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/projects/useProjects';
import { useToast } from '@/hooks/use-toast';

export const useProjectDetails = (projectId: string | undefined) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) return;
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        // Parse documents field if it exists
        const projectWithDocuments = {
          ...data,
          documents: Array.isArray(data.documents) 
            ? data.documents 
            : (data.documents ? JSON.parse(String(data.documents)) : [])
        } as Project;
        
        // Get quote count for this project
        const { count: quoteCount, error: quoteError } = await supabase
          .from('quotes')
          .select('id', { count: 'exact', head: true })
          .eq('project_id', projectId);
          
        if (quoteError) console.error('Error fetching quote count:', quoteError);
        
        setProject({
          ...projectWithDocuments,
          quote_count: quoteCount || 0
        });
      } catch (error: any) {
        console.error('Error fetching project:', error);
        toast({
          variant: 'destructive',
          title: 'Error fetching project',
          description: error.message || 'Failed to fetch project details'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, toast]);

  return { project, loading };
};
