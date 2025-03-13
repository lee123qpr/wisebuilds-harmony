
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
  { name: "Mallow", country: "Ireland" },
  
  // Added smaller towns and cities - England
  { name: "Bath", country: "UK", region: "England" },
  { name: "Blackpool", country: "UK", region: "England" },
  { name: "Gloucester", country: "UK", region: "England" },
  { name: "Ipswich", country: "UK", region: "England" },
  { name: "Lincoln", country: "UK", region: "England" },
  { name: "Northampton", country: "UK", region: "England" },
  { name: "Peterborough", country: "UK", region: "England" },
  { name: "Preston", country: "UK", region: "England" },
  { name: "Sunderland", country: "UK", region: "England" },
  { name: "Swindon", country: "UK", region: "England" },
  { name: "Wigan", country: "UK", region: "England" },
  { name: "Canterbury", country: "UK", region: "England" },
  { name: "Chelmsford", country: "UK", region: "England" },
  { name: "Colchester", country: "UK", region: "England" },
  { name: "Eastbourne", country: "UK", region: "England" },
  { name: "Harrogate", country: "UK", region: "England" },
  { name: "Hastings", country: "UK", region: "England" },
  { name: "Hereford", country: "UK", region: "England" },
  { name: "Lancaster", country: "UK", region: "England" },
  { name: "Lichfield", country: "UK", region: "England" },
  { name: "Scarborough", country: "UK", region: "England" },
  { name: "Shrewsbury", country: "UK", region: "England" },
  { name: "St Albans", country: "UK", region: "England" },
  { name: "Stratford-upon-Avon", country: "UK", region: "England" },
  { name: "Torquay", country: "UK", region: "England" },
  { name: "Winchester", country: "UK", region: "England" },
  { name: "Worcester", country: "UK", region: "England" },
  { name: "Yeovil", country: "UK", region: "England" },
  { name: "Basingstoke", country: "UK", region: "England" },
  { name: "Crawley", country: "UK", region: "England" },
  
  // Added smaller towns - Scotland
  { name: "Inverness", country: "UK", region: "Scotland" },
  { name: "Perth", country: "UK", region: "Scotland" },
  { name: "Stirling", country: "UK", region: "Scotland" },
  { name: "Ayr", country: "UK", region: "Scotland" },
  { name: "Falkirk", country: "UK", region: "Scotland" },
  { name: "Dunfermline", country: "UK", region: "Scotland" },
  { name: "Paisley", country: "UK", region: "Scotland" },
  { name: "East Kilbride", country: "UK", region: "Scotland" },
  { name: "Livingston", country: "UK", region: "Scotland" },
  { name: "Hamilton", country: "UK", region: "Scotland" },
  
  // Added smaller towns - Wales
  { name: "Newport", country: "UK", region: "Wales" },
  { name: "Wrexham", country: "UK", region: "Wales" },
  { name: "Bangor", country: "UK", region: "Wales" },
  { name: "Aberystwyth", country: "UK", region: "Wales" },
  { name: "Llandudno", country: "UK", region: "Wales" },
  { name: "Carmarthen", country: "UK", region: "Wales" },
  { name: "Merthyr Tydfil", country: "UK", region: "Wales" },
  { name: "Bridgend", country: "UK", region: "Wales" },
  { name: "Colwyn Bay", country: "UK", region: "Wales" },
  { name: "Rhyl", country: "UK", region: "Wales" },
  
  // Added smaller towns - Northern Ireland
  { name: "Lisburn", country: "UK", region: "Northern Ireland" },
  { name: "Newry", country: "UK", region: "Northern Ireland" },
  { name: "Bangor", country: "UK", region: "Northern Ireland" },
  { name: "Coleraine", country: "UK", region: "Northern Ireland" },
  { name: "Newtownards", country: "UK", region: "Northern Ireland" },
  { name: "Antrim", country: "UK", region: "Northern Ireland" },
  { name: "Omagh", country: "UK", region: "Northern Ireland" },
  { name: "Armagh", country: "UK", region: "Northern Ireland" },
  { name: "Ballymena", country: "UK", region: "Northern Ireland" },
  { name: "Enniskillen", country: "UK", region: "Northern Ireland" },
  
  // Added smaller towns - Ireland
  { name: "Droichead Nua", country: "Ireland" },
  { name: "Greystones", country: "Ireland" },
  { name: "Clonmellon", country: "Ireland" },
  { name: "Dungarvan", country: "Ireland" },
  { name: "Westport", country: "Ireland" },
  { name: "Trim", country: "Ireland" },
  { name: "Nenagh", country: "Ireland" },
  { name: "Shannon", country: "Ireland" },
  { name: "Thurles", country: "Ireland" },
  { name: "Youghal", country: "Ireland" },
  { name: "Roscrea", country: "Ireland" },
  { name: "Fermoy", country: "Ireland" },
  { name: "Kells", country: "Ireland" },
  { name: "Kildare", country: "Ireland" },
  { name: "Gorey", country: "Ireland" },
  { name: "Dunboyne", country: "Ireland" },
  { name: "Donabate", country: "Ireland" },
  { name: "Killarney", country: "Ireland" },
  { name: "Naas", country: "Ireland" },
  { name: "Skerries", country: "Ireland" }
];

export interface FilterOptions {
  country?: 'UK' | 'Ireland' | 'all';
  region?: string;
  limit?: number;
  minInputLength?: number;
}

const defaultFilterOptions: FilterOptions = {
  country: 'all',
  limit: 100, // Increased from 50 to 100
  minInputLength: 0 // Reduced to 0 to show results immediately
};

// Function to filter locations based on user input with improved options
export const filterLocations = (
  inputValue: string, 
  options: Partial<FilterOptions> = {}
): Location[] => {
  const filterOptions = { ...defaultFilterOptions, ...options };
  const lowerCaseInput = inputValue.toLowerCase().trim();
  
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
  
  // Sort results alphabetically
  filteredLocations.sort((a, b) => a.name.localeCompare(b.name));
  
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
