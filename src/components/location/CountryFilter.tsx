
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
        <button 
          type="button"
          onClick={() => setActiveFilter('all')}
          className="p-0 border-0 bg-transparent"
        >
          <Badge 
            variant={activeFilter === 'all' ? 'default' : 'outline'} 
            className="cursor-pointer"
          >
            All
          </Badge>
        </button>
        <button 
          type="button"
          onClick={() => setActiveFilter('UK')}
          className="p-0 border-0 bg-transparent"
        >
          <Badge 
            variant={activeFilter === 'UK' ? 'default' : 'outline'} 
            className="cursor-pointer"
          >
            UK
          </Badge>
        </button>
        <button 
          type="button"
          onClick={() => setActiveFilter('Ireland')}
          className="p-0 border-0 bg-transparent"
        >
          <Badge 
            variant={activeFilter === 'Ireland' ? 'default' : 'outline'} 
            className="cursor-pointer"
          >
            Ireland
          </Badge>
        </button>
      </div>
    </div>
  );
});

CountryFilter.displayName = 'CountryFilter';
