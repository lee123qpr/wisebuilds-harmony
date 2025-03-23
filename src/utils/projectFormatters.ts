
import { format, formatDistanceToNow } from 'date-fns';

// Format date string to readable format
export const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Not specified';
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    return dateString;
  }
};

// Format date as "X days ago"
export const formatDateAgo = (dateString: string | null) => {
  if (!dateString) return 'not specified';
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return dateString;
  }
};

// Format role string to readable format
export const formatRole = (role: string) => {
  if (!role || role === 'any' || role === 'Any') return 'Any';
  
  const roleMap: Record<string, string> = {
    'quantity_surveyor': 'Quantity Surveyor',
    'estimator': 'Estimator',
    'planner': 'Planner',
    'cad_engineer': 'CAD Engineer',
    'architect': 'Architect'
  };
  
  return roleMap[role] || role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Format budget string to readable format
export const formatBudget = (budget: string) => {
  if (!budget) return 'Not specified';
  
  // Improved budget formatting with £ symbol
  if (budget === 'under_1000' || budget === 'less_than_1000') return 'Less than £1,000';
  if (budget === '1000_to_5000') return '£1,000 - £5,000';
  if (budget === '5000_to_10000') return '£5,000 - £10,000';
  if (budget === '10000_to_25000') return '£10,000 - £25,000';
  if (budget === '25000_to_50000') return '£25,000 - £50,000';
  if (budget === 'more_than_50000') return 'More than £50,000';
  if (budget === '10000_to_50000') return '£10,000 - £50,000';
  if (budget === '50000_to_100000') return '£50,000 - £100,000';
  if (budget === '100000_plus') return 'Over £100,000';
  if (budget === '10000_plus') return 'Over £10,000';
  if (budget === '0-500') return '£0 - £500';
  if (budget === '500-1000') return '£500 - £1,000';
  if (budget === '1000-2500') return '£1,000 - £2,500';
  if (budget === '2500-5000') return '£2,500 - £5,000';
  if (budget === '5000-10000') return '£5,000 - £10,000';
  
  // For any other format, ensure we add the pound sign
  if (budget.includes('_')) {
    return '£' + budget
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Handle hyphenated budgets (like "2500-5000")
  if (budget.includes('-')) {
    const [min, max] = budget.split('-');
    // Format with commas for thousands
    const formattedMin = parseInt(min).toLocaleString('en-GB');
    const formattedMax = parseInt(max).toLocaleString('en-GB');
    return `£${formattedMin} - £${formattedMax}`;
  }
  
  return `£${budget}`;
};

// Format duration string to readable format
export const formatDuration = (duration: string) => {
  if (!duration) return 'Not specified';
  
  // Improved duration formatting
  if (duration === '6_weeks_plus') return '6 Weeks+';
  if (duration === '1_day') return '1 Day';
  if (duration === '3_days') return '3 Days';
  if (duration === '1_week') return '1 Week';
  if (duration === '2_weeks') return '2 Weeks';
  if (duration === '3_weeks') return '3 Weeks';
  if (duration === '4_weeks') return '4 Weeks';
  if (duration === '5_weeks') return '5 Weeks';
  if (duration === 'less_than_1_week') return 'Less than 1 Week';
  if (duration === '1_to_2_weeks') return '1-2 Weeks';
  if (duration === '2_to_4_weeks') return '2-4 Weeks';
  if (duration === '1_to_3_months') return '1-3 Months';
  if (duration === '3_to_6_months') return '3-6 Months';
  
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
  
  // Handle common work type formats
  if (workType === 'on_site') return 'On Site';
  if (workType === 'remote') return 'Remote';
  if (workType === 'hybrid') return 'Hybrid';
  
  return workType
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
