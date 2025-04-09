
import { useState, useEffect } from 'react';
import { ConflictEvent, getEventsByCountry } from '@/data/mockConflictData';
import { useToast } from '@/hooks/use-toast';
import CountryDialog from './CountryDialog';

interface SvgAfricaMapProps {
  events: ConflictEvent[];
  onCountryClick?: (countryCode: string) => void;
}

interface CountryData {
  code: string;
  name: string;
  count: number;
  events: ConflictEvent[];
}

const SvgAfricaMap = ({ events, onCountryClick }: SvgAfricaMapProps) => {
  const { toast } = useToast();
  const [svgContent, setSvgContent] = useState<string>('');
  const [countryData, setCountryData] = useState<Record<string, CountryData>>({});
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCountryEvents, setSelectedCountryEvents] = useState<ConflictEvent[]>([]);
  const [selectedCountryName, setSelectedCountryName] = useState<string>('');

  // Load SVG file
  useEffect(() => {
    fetch('/africa.svg')
      .then(response => response.text())
      .then(data => {
        setSvgContent(data);
      })
      .catch(error => {
        console.error('Error loading SVG:', error);
      });
  }, []);

  // Process event data for countries
  useEffect(() => {
    const eventsByCountry = getEventsByCountry(events);
    
    // Create mapping of country codes to event counts
    const data: Record<string, CountryData> = {};
    
    // Group events by country
    const eventsByCountryMap: Record<string, ConflictEvent[]> = {};
    events.forEach(event => {
      const countryKey = event.country;
      if (!eventsByCountryMap[countryKey]) {
        eventsByCountryMap[countryKey] = [];
      }
      eventsByCountryMap[countryKey].push(event);
    });
    
    eventsByCountry.forEach(({ country, count }) => {
      // Extract the country code from the SVG path data-id attribute
      const code = country.substring(0, 2).toUpperCase();
      data[code] = {
        code,
        name: country,
        count,
        events: eventsByCountryMap[country] || []
      };
    });
    
    setCountryData(data);
  }, [events]);

  // Function to get color based on event count
  const getCountryColor = (countryCode: string) => {
    const country = countryData[countryCode];
    
    if (!country) return '#222222'; // Dark gray for countries with no data
    
    // Color scale based on count
    const count = country.count;
    if (count > 100) return '#ef4444'; // Red for high count
    if (count > 50) return '#f97316'; // Orange for medium-high count
    if (count > 20) return '#eab308'; // Yellow for medium count
    if (count > 10) return '#84cc16'; // Light green for medium-low count
    return '#22c55e'; // Green for low count
  };

  const handleCountryClick = (countryCode: string) => {
    setSelectedCountry(countryCode);
    
    const country = countryData[countryCode];
    if (country) {
      // Show tooltip notification
      toast({
        title: country.name,
        description: `${country.count} conflict events recorded`,
      });
      
      // Set data for dialog
      setSelectedCountryEvents(country.events);
      setSelectedCountryName(country.name);
      setDialogOpen(true);
    } else {
      toast({
        title: "No Data",
        description: "No conflict events recorded for this country",
      });
    }
    
    if (onCountryClick) {
      onCountryClick(countryCode);
    }
  };
  
  return (
    <div className="w-full h-full relative overflow-hidden border border-border rounded-lg bg-background">
      {svgContent ? (
        <div 
          className="w-full h-full transform scale-95"
          dangerouslySetInnerHTML={{ 
            __html: svgContent.replace(
              /<path([^>]*)style="([^"]*)"/g, 
              (match, attributes, style) => {
                // Extract country code
                const dataIdMatch = attributes.match(/data-id="([^"]*)"/);
                const countryCode = dataIdMatch ? dataIdMatch[1] : '';
                
                // Set color based on event count
                const color = getCountryColor(countryCode);
                const selectedStyle = selectedCountry === countryCode ? 
                  'stroke-width: 2px; stroke: #f97316;' : 
                  'stroke-width: 0.75px; stroke: #6b7280;';
                
                return `<path ${attributes} style="${style}; fill: ${color}; ${selectedStyle}; cursor: pointer;" 
                  data-country="${countryCode}" 
                  class="hover:opacity-80 transition-all duration-200"
                  onclick="document.dispatchEvent(new CustomEvent('country-click', {detail: '${countryCode}'}));"
                `;
              }
            )
          }} 
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      
      {/* Event listener for SVG clicks */}
      <div className="absolute inset-0 pointer-events-none" ref={el => {
        if (!el) return;
        
        const handleEvent = (e: Event) => {
          const customEvent = e as CustomEvent;
          handleCountryClick(customEvent.detail);
        };
        
        document.addEventListener('country-click', handleEvent);
        return () => {
          document.removeEventListener('country-click', handleEvent);
        };
      }} />
      
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-md border border-border">
        <div className="text-sm font-medium mb-1">Event Count</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="w-3 h-3 bg-[#ef4444] rounded-sm"></span>
          <span>100+</span>
          <span className="w-3 h-3 bg-[#f97316] rounded-sm"></span>
          <span>50+</span>
          <span className="w-3 h-3 bg-[#eab308] rounded-sm"></span>
          <span>20+</span>
          <span className="w-3 h-3 bg-[#84cc16] rounded-sm"></span>
          <span>10+</span>
          <span className="w-3 h-3 bg-[#22c55e] rounded-sm"></span>
          <span>1-10</span>
          <span className="w-3 h-3 bg-[#222222] rounded-sm"></span>
          <span>No data</span>
        </div>
      </div>
      
      {/* Country Dialog */}
      <CountryDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        countryName={selectedCountryName}
        events={selectedCountryEvents}
      />
    </div>
  );
};

export default SvgAfricaMap;
