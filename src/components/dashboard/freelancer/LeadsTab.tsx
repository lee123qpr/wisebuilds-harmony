
import React from 'react';
import { ProjectLead } from '@/types/projects';
import LeadSettingsAlert from './leads/LeadSettingsAlert';
import { useLeadFiltering } from './leads/useLeadFiltering';
import { LeadSettings } from '@/hooks/useFreelancerDashboard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import EmptyLeadsMessage from './leads/EmptyLeadsMessage';
import LeadsHeader from './leads/LeadsHeader';
import { Badge } from '@/components/ui/badge';
import { formatDateAgo } from '@/utils/projectFormatters';
import { Skeleton } from '@/components/ui/skeleton';

interface LeadsTabProps {
  isLoadingSettings: boolean;
  isLoadingLeads?: boolean;
  leadSettings: LeadSettings | null;
  projectLeads: ProjectLead[];
}

const LeadsTab: React.FC<LeadsTabProps> = ({ 
  isLoadingSettings, 
  isLoadingLeads = false,
  leadSettings, 
  projectLeads 
}) => {
  // Handle refresh
  const handleRefresh = () => {
    console.log('Refreshing leads...');
    window.location.reload(); // Simple refresh for now
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
      <LeadsHeader onRefresh={handleRefresh} isLoading={isLoadingSettings || isLoadingLeads} />
      
      {isLoadingLeads ? (
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
              {Array(3).fill(0).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : filteredLeads.length === 0 ? (
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
