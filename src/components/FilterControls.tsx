
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FilterIcon, XIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { africanCountries, eventTypes } from '@/data/mockConflictData';

interface FilterControlsProps {
  onFilterChange: (filters: {
    startDate?: string;
    endDate?: string;
    countries: string[];
    eventTypes: string[];
  }) => void;
}

const FilterControls = ({ onFilterChange }: FilterControlsProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);

  // Update parent component when filters change
  useEffect(() => {
    onFilterChange({
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      countries: selectedCountries,
      eventTypes: selectedEventTypes,
    });
  }, [startDate, endDate, selectedCountries, selectedEventTypes, onFilterChange]);

  const resetFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedCountries([]);
    setSelectedEventTypes([]);
  };

  // Toggle country selection
  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => 
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
  };

  // Toggle event type selection
  const toggleEventType = (type: string) => {
    setSelectedEventTypes(prev => 
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  // Count active filters
  const activeFilterCount = [
    startDate !== undefined,
    endDate !== undefined,
    selectedCountries.length > 0,
    selectedEventTypes.length > 0
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FilterIcon className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetFilters}
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <XIcon className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={['date', 'countries', 'eventTypes']} className="w-full">
        <AccordionItem value="date" className="border-b border-border">
          <AccordionTrigger className="text-sm py-3">Date Range</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2 pb-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="start-date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "MMM d, yyyy") : <span>Pick date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      disabled={(date) => date > (endDate || new Date()) || date > new Date()}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date" className="text-xs">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="end-date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "MMM d, yyyy") : <span>Pick date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => (startDate ? date < startDate : false) || date > new Date()}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="countries" className="border-b border-border">
          <AccordionTrigger className="text-sm py-3">Countries</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2 pb-4">
            <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
              {africanCountries.map((country) => (
                <div key={country.code} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`country-${country.code}`} 
                    checked={selectedCountries.includes(country.name)}
                    onCheckedChange={() => toggleCountry(country.name)}
                  />
                  <Label 
                    htmlFor={`country-${country.code}`}
                    className="text-sm cursor-pointer"
                  >
                    {country.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="eventTypes" className="border-b-0">
          <AccordionTrigger className="text-sm py-3">Event Types</AccordionTrigger>
          <AccordionContent className="space-y-3 pt-2 pb-4">
            <div className="space-y-2">
              {eventTypes.map((type, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`event-type-${index}`} 
                    checked={selectedEventTypes.includes(type)}
                    onCheckedChange={() => toggleEventType(type)}
                  />
                  <Label 
                    htmlFor={`event-type-${index}`}
                    className="text-sm cursor-pointer"
                  >
                    {type}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterControls;
