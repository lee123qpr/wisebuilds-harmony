
import React, { memo } from 'react';
import { Badge } from '@/components/ui/badge';

interface RegionFilterProps {
  regions: string[];
  activeRegion: string | null;
  setActiveRegion: (region: string | null) => void;
}

export const RegionFilter: React.FC<RegionFilterProps> = memo(({ 
  regions, 
  activeRegion, 
  setActiveRegion 
}) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Region</h4>
      <div className="flex flex-wrap gap-2">
        {regions.map(region => (
          <button 
            key={region}
            type="button"
            onClick={() => setActiveRegion(activeRegion === region ? null : region)}
            className="p-0 border-0 bg-transparent"
          >
            <Badge 
              variant={activeRegion === region ? 'default' : 'outline'} 
              className="cursor-pointer"
            >
              {region}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
});

RegionFilter.displayName = 'RegionFilter';
