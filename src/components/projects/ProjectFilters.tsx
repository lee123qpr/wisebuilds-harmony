
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

type ProjectFiltersProps = {
  searchQuery: string;
  statusFilter: string;
  hiringFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onHiringChange: (value: string) => void;
};

const ProjectFilters = ({ 
  searchQuery, 
  statusFilter, 
  hiringFilter, 
  onSearchChange, 
  onStatusChange, 
  onHiringChange 
}: ProjectFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-between">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Select value={hiringFilter} onValueChange={onHiringChange}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Hiring" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Hiring</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="ready">Ready to hire</SelectItem>
            <SelectItem value="enquiring">Enquiring</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ProjectFilters;
