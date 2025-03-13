
import React, { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CountryFilter } from './CountryFilter';
import { RegionFilter } from './RegionFilter';

interface FilterTabsProps {
  activeFilter: 'all' | 'UK' | 'Ireland';
  setActiveFilter: (filter: 'all' | 'UK' | 'Ireland') => void;
  activeRegion: string | null;
  setActiveRegion: (region: string | null) => void;
  resetFilters: () => void;
}

export const FilterTabs: React.FC<FilterTabsProps> = memo(({
  activeFilter,
  setActiveFilter,
  activeRegion,
  setActiveRegion,
  resetFilters,
}) => {
  const regions = {
    UK: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    Ireland: []
  };

  return (
    <Tabs defaultValue="search" className="w-full">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="filter">Filter</TabsTrigger>
        </TabsList>
        {(activeFilter !== 'all' || activeRegion) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="text-xs"
            type="button"
          >
            Reset
          </Button>
        )}
      </div>
      
      <TabsContent value="search" className="p-0">
        {/* Search content is provided by parent */}
      </TabsContent>
      
      <TabsContent value="filter" className="p-3 space-y-4">
        <CountryFilter 
          activeFilter={activeFilter} 
          setActiveFilter={setActiveFilter} 
        />
        
        {activeFilter === 'UK' && (
          <RegionFilter 
            regions={regions.UK} 
            activeRegion={activeRegion} 
            setActiveRegion={setActiveRegion} 
          />
        )}
      </TabsContent>
    </Tabs>
  );
});

FilterTabs.displayName = 'FilterTabs';
