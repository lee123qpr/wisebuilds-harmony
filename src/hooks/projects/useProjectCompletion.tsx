
import { checkCompletionStatus } from './completion/api';
import { ProjectCompletionProps } from './completion/types';
import { 
  useMarkProjectCompletedMutation, 
  useMarkProjectIncompleteMutation 
} from './completion/mutations';

/**
 * Hook for managing project completion logic
 */
export const useProjectCompletion = (props: ProjectCompletionProps) => {
  const markProjectCompletedMutation = useMarkProjectCompletedMutation(props);
  const markProjectIncompleteMutation = useMarkProjectIncompleteMutation(props);
  
  return {
    markProjectCompleted: markProjectCompletedMutation.mutate,
    isMarkingComplete: markProjectCompletedMutation.isPending,
    markProjectIncomplete: markProjectIncompleteMutation.mutate,
    isMarkingIncomplete: markProjectIncompleteMutation.isPending,
    checkCompletionStatus,
  };
};

// Re-export the checkCompletionStatus for components that use it directly
export { checkCompletionStatus };
