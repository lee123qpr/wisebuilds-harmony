
// Calculate credits required for project based on budget, duration, and hiring status

// Credit values for budget options
export const budgetCredits = {
  '0-500': 1,
  '500-1000': 2,
  '1000-2500': 3,
  '2500-5000': 4,
  '5000-10000': 5,
  '10000_plus': 6
};

// Credit values for duration options
export const durationCredits = {
  '1_day': 1,
  '3_days': 2,
  '1_week': 3,
  '2_weeks': 4,
  '3_weeks': 5,
  '4_weeks': 6,
  '5_weeks': 7,
  '6_weeks_plus': 8
};

// Credit values for hiring status options
export const hiringStatusCredits = {
  'enquiring': 1,
  'ready': 2,
  'urgent': 3
};

// Base credit cost applied to all projects
const BASE_CREDIT = 1;

/**
 * Calculate the total credits required for a project
 * @param budget - The project budget range
 * @param duration - The project duration
 * @param hiringStatus - The project hiring status
 * @returns Total credits required
 */
export const calculateLeadCredits = (
  budget: string,
  duration: string,
  hiringStatus: string
): number => {
  // Get credit values for each parameter (default to 0 if not found)
  const budgetValue = budgetCredits[budget as keyof typeof budgetCredits] || 0;
  const durationValue = durationCredits[duration as keyof typeof durationCredits] || 0;
  const hiringValue = hiringStatusCredits[hiringStatus as keyof typeof hiringStatusCredits] || 0;
  
  // Calculate total credits (sum of individual credits + base credit)
  const totalCredits = budgetValue + durationValue + hiringValue + BASE_CREDIT;
  
  console.log(`Credit calculation breakdown:
  - Budget (${budget}): ${budgetValue} credits
  - Duration (${duration}): ${durationValue} credits 
  - Hiring Status (${hiringStatus}): ${hiringValue} credits
  - Base credit: ${BASE_CREDIT}
  - Total: ${totalCredits} credits`);
  
  return totalCredits;
};
