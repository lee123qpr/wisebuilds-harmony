
import { Location } from './types';

// Get location display string (with region/country if requested)
export const getLocationDisplayString = (
  location: Location, 
  showRegion = false, 
  showCountry = false
): string => {
  let display = location.name;
  
  if (showRegion && location.region) {
    display += `, ${location.region}`;
  }
  
  if (showCountry) {
    display += `, ${location.country}`;
  }
  
  return display;
};

// Get just the names of locations (for backward compatibility)
export const getLocationNames = (locations: Location[]): string[] => {
  return locations.map(location => location.name);
};
