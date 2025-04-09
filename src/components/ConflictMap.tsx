
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ConflictEvent } from '@/data/mockConflictData';

// Temporary Mapbox token input - in production this should be an environment variable
const DEFAULT_TOKEN = "ADD_YOUR_MAPBOX_TOKEN_HERE";

interface ConflictMapProps {
  events: ConflictEvent[];
  onEventClick?: (event: ConflictEvent) => void;
}

const ConflictMap = ({ events, onEventClick }: ConflictMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>(DEFAULT_TOKEN);
  const [showTokenInput, setShowTokenInput] = useState<boolean>(DEFAULT_TOKEN === "ADD_YOUR_MAPBOX_TOKEN_HERE");

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || mapboxToken === DEFAULT_TOKEN) return;

    mapboxgl.accessToken = mapboxToken;
    
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [15, 0], // Center on Africa
      zoom: 2.5,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add fullscreen control
    map.current.addControl(
      new mapboxgl.FullscreenControl(),
      'top-right'
    );

    // Clean up on unmount
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Add event markers when events or map changes
  useEffect(() => {
    if (!map.current || !events.length) return;

    // Wait for map to load before adding markers
    const addMarkers = () => {
      // Clear existing markers
      const existingMarkers = document.querySelectorAll('.mapboxgl-marker');
      existingMarkers.forEach(marker => marker.remove());

      // Add new markers
      events.forEach(event => {
        const { latitude, longitude, eventType, fatalities } = event;
        
        // Create marker element
        const markerEl = document.createElement('div');
        markerEl.className = 'relative w-4 h-4 rounded-full';
        
        // Set marker color based on event type and size based on fatalities
        let markerColor = '';
        let markerSize = '16px';
        
        switch(eventType) {
          case 'Armed Clash':
            markerColor = 'bg-conflict';
            markerSize = `${16 + Math.min(fatalities, 50) / 2}px`;
            break;
          case 'Violence Against Civilians':
            markerColor = 'bg-conflict-high';
            markerSize = `${16 + Math.min(fatalities, 30) / 2}px`;
            break;
          case 'Riot':
            markerColor = 'bg-conflict-medium';
            break;
          case 'Protest':
            markerColor = 'bg-conflict-low';
            break;
          default:
            markerColor = 'bg-gray-400';
        }
        
        markerEl.className = `${markerColor} rounded-full animate-pulse-slow`;
        markerEl.style.width = markerSize;
        markerEl.style.height = markerSize;
        
        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div>
            <h3 class="font-semibold">${eventType}</h3>
            <p class="text-sm text-muted-foreground">${event.date}</p>
            <p class="text-sm">${event.country}, ${event.region}</p>
            <p class="text-sm mt-1">Fatalities: <span class="font-semibold text-conflict-high">${fatalities}</span></p>
            <p class="text-sm mt-1">${event.description}</p>
          </div>
        `);
        
        // Create marker
        const marker = new mapboxgl.Marker({
          element: markerEl,
          anchor: 'center'
        })
          .setLngLat([longitude, latitude])
          .setPopup(popup);
          
        marker.getElement().addEventListener('click', () => {
          if (onEventClick) {
            onEventClick(event);
          }
        });
          
        marker.addTo(map.current!);
      });
    };

    if (map.current.loaded()) {
      addMarkers();
    } else {
      map.current.on('load', addMarkers);
    }
    
    // Clean up
    return () => {
      map.current?.off('load', addMarkers);
    };
  }, [events, onEventClick]);

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowTokenInput(false);
  };

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-border">
      {showTokenInput ? (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-10 p-4">
          <form onSubmit={handleTokenSubmit} className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold">MapBox API Token Required</h3>
            <p className="text-sm text-muted-foreground">
              Please enter your Mapbox public token to enable the interactive map.
              You can get one for free at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>.
            </p>
            <div className="space-y-2">
              <input
                type="text"
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
                placeholder="Enter your Mapbox token"
                className="w-full px-3 py-2 bg-background border border-input rounded-md"
              />
              <button 
                type="submit" 
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Apply Token
              </button>
            </div>
          </form>
        </div>
      ) : null}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};

export default ConflictMap;
