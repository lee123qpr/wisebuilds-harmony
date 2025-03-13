
import { format } from 'date-fns';

// Format date string to readable format
export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not specified';
  try {
    return format(new Date(dateString), 'dd MMM yyyy');
  } catch (error) {
    return dateString;
  }
};

// Format role string to readable format
export const formatRole = (role: string) => {
  if (!role) return 'Not specified';
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format budget string to readable format
export const formatBudget = (budget: string) => {
  if (!budget) return 'Not specified';
  if (budget === 'under_1000') return 'Under £1,000';
  if (budget === '1000_to_5000') return '£1,000 - £5,000';
  if (budget === '5000_to_10000') return '£5,000 - £10,000';
  if (budget === '10000_to_50000') return '£10,000 - £50,000';
  if (budget === '50000_to_100000') return '£50,000 - £100,000';
  if (budget === '100000_plus') return 'Over £100,000';
  
  return budget
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format duration string to readable format
export const formatDuration = (duration: string) => {
  if (!duration) return 'Not specified';
  return duration
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format location string to readable format
export const formatLocation = (location: string) => {
  if (!location) return 'Not specified';
  return location.charAt(0).toUpperCase() + location.slice(1);
};

// Format work type string to readable format
export const formatWorkType = (workType: string) => {
  if (!workType) return 'Not specified';
  return workType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
