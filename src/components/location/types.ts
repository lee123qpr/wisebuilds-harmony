
// Define props interface for LocationField
export interface LocationFieldProps {
  form: any; // This is generic to work with different form schemas
  name?: string; // Optional field name, defaults to 'location'
  label?: string; // Optional label, defaults to 'Location'
  description?: string; // Optional description text
}
