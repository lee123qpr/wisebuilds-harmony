
import { LeadSettings } from '../types';
import { ProjectLead } from '@/types/projects';

export const generateProjectLeads = (settings: LeadSettings): ProjectLead[] => {
  return [
    {
      id: '1',
      title: `${settings.role} needed in ${settings.location}`,
      description: `Looking for an experienced professional to handle a project in ${settings.location}.`,
      budget: settings.max_budget || '£2,000-£3,500',
      role: settings.role,
      created_at: new Date().toISOString(),
      location: settings.location,
      work_type: settings.work_type || 'on_site',
      tags: ['Professional', 'Experienced'],
      duration: '2_weeks',
      hiring_status: 'active',
      requires_equipment: false,
      requires_security_check: false,
      requires_insurance: true,
      requires_qualifications: true,
      published: true,
      client_id: 'client123',
      client_name: 'John Smith',
      client_company: 'Smith Enterprises',
      start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      applications: 0,
      documents: [],
      requires_site_visits: false,
      status: 'active',
      updated_at: new Date().toISOString(),
      user_id: 'client123',
      purchases_count: 0
    },
    {
      id: '2',
      title: `Urgent ${settings.role} project`,
      description: 'Client looking for immediate start on a high-priority project.',
      budget: '£3,000-£5,000',
      role: settings.role,
      created_at: new Date().toISOString(),
      location: settings.location,
      work_type: settings.work_type || 'on_site',
      tags: ['Urgent', 'High-Priority'],
      duration: '1_week',
      hiring_status: 'urgent',
      requires_equipment: true,
      requires_security_check: true,
      requires_insurance: true,
      requires_qualifications: false,
      published: true,
      client_id: 'client456',
      client_name: 'Alice Johnson',
      client_company: 'Johnson & Co',
      start_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      applications: 2,
      documents: [],
      requires_site_visits: true,
      status: 'active',
      updated_at: new Date().toISOString(),
      user_id: 'client456',
      purchases_count: 2
    },
    {
      id: '3',
      title: 'Website Developer needed',
      description: 'Looking for a web developer to create a new e-commerce site.',
      budget: '£1,500-£3,000',
      role: 'web_developer',
      created_at: new Date().toISOString(),
      location: settings.location,
      tags: ['Web', 'E-commerce'],
      duration: '4_weeks',
      work_type: 'remote',
      hiring_status: 'active',
      requires_equipment: false,
      requires_security_check: false,
      requires_insurance: false,
      requires_qualifications: true,
      published: true,
      client_id: 'client789',
      client_name: 'Robert Brown',
      client_company: 'Brown Digital',
      start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      applications: 5,
      documents: [],
      requires_site_visits: false,
      status: 'active',
      updated_at: new Date().toISOString(),
      user_id: 'client789',
      purchases_count: 3
    },
    {
      id: '4',
      title: `${settings.role} project in Birmingham`,
      description: 'Major renovation project requiring an experienced professional.',
      budget: '£5,000-£10,000',
      role: settings.role,
      created_at: new Date().toISOString(),
      location: 'Birmingham',
      tags: ['Renovation', 'Large-Scale'],
      duration: '6_weeks_plus',
      work_type: 'on_site',
      hiring_status: 'active',
      requires_equipment: true,
      requires_security_check: true,
      requires_insurance: true,
      requires_qualifications: true,
      published: true,
      client_id: 'client101',
      client_name: 'Emma Wilson',
      client_company: 'Wilson Projects',
      start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      applications: 3,
      documents: [],
      requires_site_visits: true,
      status: 'active',
      updated_at: new Date().toISOString(),
      user_id: 'client101',
      purchases_count: 1
    },
    {
      id: '5',
      title: `Remote ${settings.role} opportunity`,
      description: 'Virtual project that can be completed entirely remotely.',
      budget: '£2,000-£4,000',
      role: settings.role,
      created_at: new Date().toISOString(),
      location: settings.location,
      work_type: settings.work_type === 'remote' ? 'on_site' : 'remote',
      tags: ['Remote', 'Virtual'],
      duration: '3_weeks',
      hiring_status: 'active',
      requires_equipment: false,
      requires_security_check: false,
      requires_insurance: false,
      requires_qualifications: false,
      published: true,
      client_id: 'client202',
      client_name: 'David Green',
      client_company: 'Green Solutions',
      start_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      applications: 1,
      documents: [],
      requires_site_visits: false,
      status: 'active',
      updated_at: new Date().toISOString(),
      user_id: 'client202',
      purchases_count: 0
    }
  ];
};
