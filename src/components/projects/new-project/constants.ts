
export const roleOptions = [
  { value: 'quantity_surveyor', label: 'Quantity Surveyor' },
  { value: 'estimator', label: 'Estimator' },
  { value: 'planner', label: 'Planner' },
  { value: 'cad_engineer', label: 'CAD Engineer' },
  { value: 'architect', label: 'Architect' }
];

export const workTypeOptions = [
  { value: 'onsite', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' }
];

export const durationOptions = [
  { value: '1_day', label: '1 day' },
  { value: '3_days', label: '3 days' },
  { value: '1_week', label: '1 week' },
  { value: '2_weeks', label: '2 weeks' },
  { value: '3_weeks', label: '3 weeks' },
  { value: '4_weeks', label: '4 weeks' },
  { value: '5_weeks', label: '5 weeks' },
  { value: '6_weeks_plus', label: '6 weeks+' }
];

export const budgetOptions = [
  { value: '0-500', label: '£0-£500' },
  { value: '500-1000', label: '£500-£1,000' },
  { value: '1000-2500', label: '£1,000-£2,500' },
  { value: '2500-5000', label: '£2,500-£5,000' },
  { value: '5000-10000', label: '£5,000-£10,000' },
  { value: '10000_plus', label: '£10,000+' }
];

export const hiringStatusOptions = [
  { value: 'enquiring', label: 'Just enquiring' },
  { value: 'ready', label: 'Ready to hire' },
  { value: 'urgent', label: 'Urgent' }
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ACCEPTED_FILE_TYPES = [
  'application/pdf', // PDF
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/msword', // DOC
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
  'application/vnd.ms-excel', // XLS
  'image/jpeg', // JPG/JPEG
  'image/png', // PNG
  'application/acad', // DWG
  'image/vnd.dwg', // DWG alternative
  'application/dwg', // DWG alternative
  'application/x-dwg' // DWG alternative
];
