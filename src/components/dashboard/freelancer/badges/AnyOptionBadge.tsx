
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';

interface AnyOptionBadgeProps {
  label: string;
}

const AnyOptionBadge = ({ label }: AnyOptionBadgeProps) => {
  return (
    <Badge variant="outline" className="flex items-center gap-1.5 py-1.5 px-3 bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]">
      <Filter className="h-3.5 w-3.5" />
      Any {label}
    </Badge>
  );
};

export default AnyOptionBadge;
