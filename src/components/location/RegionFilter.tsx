
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
          <Badge 
            key={region}
            variant={activeRegion === region ? 'default' : 'outline'} 
            className="cursor-pointer"
            onClick={() => setActiveRegion(activeRegion === region ? null : region)}
          >
            {region}
          </Badge>
        ))}
      </div>
    </div>
  );
});

RegionFilter.displayName = 'RegionFilter';
