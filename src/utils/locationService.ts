
// UK and Ireland major cities and towns
// This is a simplified list - in a production app, this would be much more comprehensive
// or fetched from an external API

export const ukIrelandLocations = [
  // UK major cities
  "London",
  "Birmingham",
  "Manchester",
  "Glasgow",
  "Liverpool",
  "Leeds",
  "Newcastle",
  "Sheffield",
  "Bristol",
  "Edinburgh",
  "Cardiff",
  "Belfast",
  "Aberdeen",
  "Dundee",
  "Leicester",
  "Coventry",
  "Nottingham",
  "Hull",
  "Bradford",
  "Wolverhampton",
  "Plymouth",
  "Southampton",
  "Brighton",
  "Derby",
  "Portsmouth",
  "Swansea",
  "Sunderland",
  "Oxford",
  "Cambridge",
  "York",
  "Exeter",
  "Norwich",
  "Chester",
  "Reading",
  "Milton Keynes",
  "Bournemouth",
  "Warrington",
  "Luton",
  
  // Ireland major cities and towns
  "Dublin",
  "Cork",
  "Limerick",
  "Galway",
  "Waterford",
  "Drogheda",
  "Dundalk",
  "Swords",
  "Bray",
  "Navan",
  "Kilkenny",
  "Ennis",
  "Carlow",
  "Tralee",
  "Newbridge",
  "Portlaoise",
  "Mullingar",
  "Wexford",
  "Letterkenny",
  "Sligo",
  "Athlone",
  "Celbridge",
  "Clonmel",
  "Malahide",
  "Carrigaline",
  "Leixlip",
  "Tullamore",
  "Maynooth",
  "Wicklow",
  "Ashbourne",
  "Arklow",
  "Cobh",
  "Midleton",
  "Mallow"
];

// Function to filter locations based on user input
export const filterLocations = (inputValue: string): string[] => {
  const lowerCaseInput = inputValue.toLowerCase();
  
  // Return empty array if input is too short to avoid overwhelming dropdown
  if (lowerCaseInput.length < 2) return [];
  
  return ukIrelandLocations.filter(location =>
    location.toLowerCase().includes(lowerCaseInput)
  ).slice(0, 10); // Limit to 10 results for better UX
};
