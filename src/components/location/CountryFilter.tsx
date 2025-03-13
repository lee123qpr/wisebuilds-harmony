
import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';

interface CountryFilterProps {
  activeFilter: 'all' | 'UK' | 'Ireland';
  setActiveFilter: (filter: 'all' | 'UK' | 'Ireland') => void;
}

export const CountryFilter: React.FC<CountryFilterProps> = memo(({ 
  activeFilter, 
  setActiveFilter 
}) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Country</h4>
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={activeFilter === 'all' ? 'default' : 'outline'} 
          className="cursor-pointer"
          onClick={() => setActiveFilter('all')}
          type="button"
        >
          All
        </Badge>
        <Badge 
          variant={activeFilter === 'UK' ? 'default' : 'outline'} 
          className="cursor-pointer"
          onClick={() => setActiveFilter('UK')}
          type="button"
        >
          UK
        </Badge>
        <Badge 
          variant={activeFilter === 'Ireland' ? 'default' : 'outline'} 
          className="cursor-pointer"
          onClick={() => setActiveFilter('Ireland')}
          type="button"
        >
          Ireland
        </Badge>
      </div>
    </div>
  );
});

CountryFilter.displayName = 'CountryFilter';
