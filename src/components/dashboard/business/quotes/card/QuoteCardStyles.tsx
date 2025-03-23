
import { QuoteWithFreelancer } from '@/types/quotes';

export const getQuoteCardStyle = (status: QuoteWithFreelancer['status'] | string | undefined) => {
  switch (status) {
    case 'accepted':
      return 'border-2 border-green-500 bg-green-50';
    case 'declined':
      return 'border-2 border-red-500 bg-red-50';
    default:
      return 'border-2 border-amber-500 bg-yellow-50'; // Default to pending style
  }
};
