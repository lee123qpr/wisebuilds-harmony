
import React from 'react';
import { ProjectLead } from '@/types/projects';
import LeadSettingsAlert from './leads/LeadSettingsAlert';
import { useLeadFiltering } from './leads/useLeadFiltering';
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyLeadsMessage from './leads/EmptyLeadsMessage';
import LeadsHeader from './leads/LeadsHeader';
import { isUserFreelancer } from '@/hooks/verification/services/user-verification';
import { Badge } from '@/components/ui/badge';
import { formatDateAgo } from '@/utils/projectFormatters';

interface LeadsTabProps {
  isLoadingSettings: boolean;
  leadSettings: LeadSettings | null;
  projectLeads: ProjectLead[];
}

const LeadsTab: React.FC<LeadsTabProps> = ({ isLoadingSettings, leadSettings, projectLeads }) => {
  // Handle refresh
  const handleRefresh = () => {
    console.log('Refreshing leads...');
    // This would typically refresh the lead data
  };
  
  // Use our custom hook for lead filtering
  const { 
    filteredLeads
  } = useLeadFiltering(leadSettings, projectLeads);
  
  // If loading or no settings, show alert
  if (isLoadingSettings || !leadSettings) {
    return <LeadSettingsAlert isLoading={isLoadingSettings} />;
  }
  
  return (
    <div className="space-y-4">
      <LeadsHeader onRefresh={handleRefresh} isLoading={isLoadingSettings} />
      
      {filteredLeads.length === 0 ? (
        <EmptyLeadsMessage />
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Work Type</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Posted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.title}</TableCell>
                  <TableCell>{lead.location}</TableCell>
                  <TableCell>{lead.work_type}</TableCell>
                  <TableCell>{lead.budget}</TableCell>
                  <TableCell>{formatDateAgo(lead.created_at)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {lead.hiring_status || 'Open'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <a href={`/projects/${lead.id}`} className="text-primary hover:underline">
                      View Details
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default LeadsTab;
