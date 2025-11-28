'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CalendarIcon, FilterIcon, X } from 'lucide-react';

interface FilterControlsProps {
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  statusOptions: string[];
}

const FilterControls: React.FC<FilterControlsProps> = ({ 
  onFilterChange, 
  onClearFilters,
  statusOptions
}) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const applyFilters = () => {
    onFilterChange({
      search,
      status,
      startDate: startDate || null,
      endDate: endDate || null,
    });
  };

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    onClearFilters();
    onFilterChange({
      search: '',
      status: '',
      startDate: null,
      endDate: null,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Input
          placeholder="Search applications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((statusOption) => (
              <SelectItem key={statusOption} value={statusOption}>
                {statusOption.replace('_', ' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button onClick={() => setShowAdvanced(!showAdvanced)} variant="outline" size="sm">
          <FilterIcon className="h-4 w-4 mr-1" />
          {showAdvanced ? 'Hide Filters' : 'Advanced Filters'}
        </Button>
        
        <Button onClick={applyFilters} variant="default" size="sm">
          Apply
        </Button>
        
        <Button onClick={clearFilters} variant="outline" size="sm">
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <div className="relative">
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <div className="relative">
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9"
              />
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;