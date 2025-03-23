
import { cn } from '@/lib/utils';

export const getCardStyles = (isFullyCompleted: boolean, isPartiallyCompleted: boolean) => {
  if (isFullyCompleted) return "border-2 border-green-500";
  if (isPartiallyCompleted) return "border-2 border-blue-500";
  return "border-2 border-green-500"; // Active jobs are green
};
