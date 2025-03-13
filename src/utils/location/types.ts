
// Types for location data
export interface Location {
  name: string;
  country: 'UK' | 'Ireland';
  region?: string;
}

export interface FilterOptions {
  country?: 'UK' | 'Ireland' | 'all';
  region?: string;
  limit?: number;
  minInputLength?: number;
}
