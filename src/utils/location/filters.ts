
import { Location, FilterOptions } from './types';
import { ukIrelandLocations } from './data';

const defaultFilterOptions: FilterOptions = {
  country: 'all',
  limit: 100,
  minInputLength: 0
};

// Function to filter locations based on user input with improved options
export const filterLocations = (
  inputValue: string, 
  options: Partial<FilterOptions> = {}
): Location[] => {
  const filterOptions = { ...defaultFilterOptions, ...options };
  const lowerCaseInput = inputValue.toLowerCase().trim();
  
  // Start with a shallow copy to avoid modifying the original
  let filteredLocations = [...ukIrelandLocations];
  
  // Filter by country if specified
  if (filterOptions.country && filterOptions.country !== 'all') {
    filteredLocations = filteredLocations.filter(
      location => location.country === filterOptions.country
    );
  }
  
  // Filter by region if specified
  if (filterOptions.region) {
    filteredLocations = filteredLocations.filter(
      location => location.region === filterOptions.region
    );
  }
  
  // Filter by name match if there's input
  if (lowerCaseInput) {
    filteredLocations = filteredLocations.filter(location =>
      location.name.toLowerCase().includes(lowerCaseInput)
    );
  }
  
  // Sort results alphabetically
  filteredLocations.sort((a, b) => a.name.localeCompare(b.name));
  
  // Limit results for better UX
  return filteredLocations.slice(0, filterOptions.limit);
};

// Function to find a location by name
export const findLocationByName = (name: string): Location | undefined => {
  return ukIrelandLocations.find(
    location => location.name.toLowerCase() === name.toLowerCase()
  );
};
