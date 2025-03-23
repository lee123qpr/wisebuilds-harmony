
import { cn } from '@/lib/utils';

export const getQuoteCardStyle = (status?: string) => {
  switch (status) {
    case 'accepted':
      return "border-2 border-green-500";
    case 'pending':
      return "border-2 border-amber-500";
    case 'declined':
      return "border-2 border-red-500";
    default:
      return "border-2 border-gray-300";
  }
};
