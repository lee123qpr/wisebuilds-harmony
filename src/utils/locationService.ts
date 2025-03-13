
// Organized UK and Ireland locations
// This is a simplified list - in a production app, this could be fetched from an external API

// Types for location data
export interface Location {
  name: string;
  country: 'UK' | 'Ireland';
  region?: string;
}

// UK major cities and towns organized by country and region
export const ukIrelandLocations: Location[] = [
  // UK major cities
  { name: "London", country: "UK", region: "England" },
  { name: "Birmingham", country: "UK", region: "England" },
  { name: "Manchester", country: "UK", region: "England" },
  { name: "Liverpool", country: "UK", region: "England" },
  { name: "Leeds", country: "UK", region: "England" },
  { name: "Newcastle", country: "UK", region: "England" },
  { name: "Sheffield", country: "UK", region: "England" },
  { name: "Bristol", country: "UK", region: "England" },
  { name: "Leicester", country: "UK", region: "England" },
  { name: "Coventry", country: "UK", region: "England" },
  { name: "Nottingham", country: "UK", region: "England" },
  { name: "Hull", country: "UK", region: "England" },
  { name: "Bradford", country: "UK", region: "England" },
  { name: "Wolverhampton", country: "UK", region: "England" },
  { name: "Plymouth", country: "UK", region: "England" },
  { name: "Southampton", country: "UK", region: "England" },
  { name: "Brighton", country: "UK", region: "England" },
  { name: "Derby", country: "UK", region: "England" },
  { name: "Portsmouth", country: "UK", region: "England" },
  { name: "Oxford", country: "UK", region: "England" },
  { name: "Cambridge", country: "UK", region: "England" },
  { name: "York", country: "UK", region: "England" },
  { name: "Exeter", country: "UK", region: "England" },
  { name: "Norwich", country: "UK", region: "England" },
  { name: "Chester", country: "UK", region: "England" },
  { name: "Reading", country: "UK", region: "England" },
  { name: "Milton Keynes", country: "UK", region: "England" },
  { name: "Bournemouth", country: "UK", region: "England" },
  { name: "Warrington", country: "UK", region: "England" },
  { name: "Luton", country: "UK", region: "England" },
  
  // Scotland
  { name: "Glasgow", country: "UK", region: "Scotland" },
  { name: "Edinburgh", country: "UK", region: "Scotland" },
  { name: "Aberdeen", country: "UK", region: "Scotland" },
  { name: "Dundee", country: "UK", region: "Scotland" },
  
  // Wales
  { name: "Cardiff", country: "UK", region: "Wales" },
  { name: "Swansea", country: "UK", region: "Wales" },
  
  // Northern Ireland
  { name: "Belfast", country: "UK", region: "Northern Ireland" },
  { name: "Derry", country: "UK", region: "Northern Ireland" },
  
  // Ireland major cities and towns
  { name: "Dublin", country: "Ireland" },
  { name: "Cork", country: "Ireland" },
  { name: "Limerick", country: "Ireland" },
  { name: "Galway", country: "Ireland" },
  { name: "Waterford", country: "Ireland" },
  { name: "Drogheda", country: "Ireland" },
  { name: "Dundalk", country: "Ireland" },
  { name: "Swords", country: "Ireland" },
  { name: "Bray", country: "Ireland" },
  { name: "Navan", country: "Ireland" },
  { name: "Kilkenny", country: "Ireland" },
  { name: "Ennis", country: "Ireland" },
  { name: "Carlow", country: "Ireland" },
  { name: "Tralee", country: "Ireland" },
  { name: "Newbridge", country: "Ireland" },
  { name: "Portlaoise", country: "Ireland" },
  { name: "Mullingar", country: "Ireland" },
  { name: "Wexford", country: "Ireland" },
  { name: "Letterkenny", country: "Ireland" },
  { name: "Sligo", country: "Ireland" },
  { name: "Athlone", country: "Ireland" },
  { name: "Celbridge", country: "Ireland" },
  { name: "Clonmel", country: "Ireland" },
  { name: "Malahide", country: "Ireland" },
  { name: "Carrigaline", country: "Ireland" },
  { name: "Leixlip", country: "Ireland" },
  { name: "Tullamore", country: "Ireland" },
  { name: "Maynooth", country: "Ireland" },
  { name: "Wicklow", country: "Ireland" },
  { name: "Ashbourne", country: "Ireland" },
  { name: "Arklow", country: "Ireland" },
  { name: "Cobh", country: "Ireland" },
  { name: "Midleton", country: "Ireland" },
  { name: "Mallow", country: "Ireland" }
];

export interface FilterOptions {
  country?: 'UK' | 'Ireland' | 'all';
  region?: string;
  limit?: number;
  minInputLength?: number;
}

const defaultFilterOptions: FilterOptions = {
  country: 'all',
  limit: 50, // Increased from 10 to 50
  minInputLength: 1 // Reduced from 2 to 1 to show results more quickly
};

// Function to filter locations based on user input with improved options
export const filterLocations = (
  inputValue: string, 
  options: Partial<FilterOptions> = {}
): Location[] => {
  const filterOptions = { ...defaultFilterOptions, ...options };
  const lowerCaseInput = inputValue.toLowerCase();
  
  // Return some results even if input is very short, to help with exploration
  if (lowerCaseInput.length < filterOptions.minInputLength! && 
      !options.country && 
      !options.region) {
    return [];
  }
  
  let filteredLocations = ukIrelandLocations;
  
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
  
  // Limit results for better UX
  return filteredLocations.slice(0, filterOptions.limit);
};

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
export const getLocationNames = (): string[] => {
  return ukIrelandLocations.map(location => location.name);
};

// Function to find a location by name
export const findLocationByName = (name: string): Location | undefined => {
  return ukIrelandLocations.find(
    location => location.name.toLowerCase() === name.toLowerCase()
  );
};
