
export interface ConflictEvent {
  id: string;
  date: string;
  country: string;
  region: string;
  eventType: 'Armed Clash' | 'Violence Against Civilians' | 'Protest' | 'Riot' | 'Strategic Development';
  fatalities: number;
  injuries: number;
  actors: string[];
  description: string;
  latitude: number;
  longitude: number;
}

export interface Country {
  name: string;
  code: string;
  regions: string[];
}

export const africanCountries: Country[] = [
  { name: 'Nigeria', code: 'NG', regions: ['Lagos', 'Abuja', 'Kano', 'Kaduna'] },
  { name: 'Ethiopia', code: 'ET', regions: ['Addis Ababa', 'Amhara', 'Oromia', 'Tigray'] },
  { name: 'Egypt', code: 'EG', regions: ['Cairo', 'Alexandria', 'Giza', 'Luxor'] },
  { name: 'Democratic Republic of Congo', code: 'CD', regions: ['Kinshasa', 'North Kivu', 'South Kivu', 'Ituri'] },
  { name: 'South Africa', code: 'ZA', regions: ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape'] },
  { name: 'Somalia', code: 'SO', regions: ['Mogadishu', 'Puntland', 'Somaliland', 'Jubaland'] },
  { name: 'Kenya', code: 'KE', regions: ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru'] },
  { name: 'Sudan', code: 'SD', regions: ['Khartoum', 'Darfur', 'South Kordofan', 'Blue Nile'] },
  { name: 'Mali', code: 'ML', regions: ['Bamako', 'Gao', 'Timbuktu', 'Mopti'] },
  { name: 'Burkina Faso', code: 'BF', regions: ['Ouagadougou', 'Bobo-Dioulasso', 'Sahel', 'East'] }
];

export const eventTypes = ['Armed Clash', 'Violence Against Civilians', 'Protest', 'Riot', 'Strategic Development'];

export const actorGroups = [
  'Government Forces', 
  'Boko Haram', 
  'Al-Shabaab', 
  'Protesters', 
  'Civilian Population',
  'Armed Militia',
  'Rebel Group',
  'Peacekeepers',
  'Police Forces',
  'Unknown Armed Group'
];

// Generate random dates within range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate a random number between min and max
const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Generate random longitude within Africa (roughly -20 to 50)
const randomLongitude = () => {
  return -20 + Math.random() * 70;
};

// Generate random latitude within Africa (roughly -35 to 35)
const randomLatitude = () => {
  return -35 + Math.random() * 70;
};

// Generate random set of actors
const randomActors = () => {
  const numberOfActors = randomNumber(1, 3);
  const selectedActors = [];
  for (let i = 0; i < numberOfActors; i++) {
    const actor = actorGroups[randomNumber(0, actorGroups.length - 1)];
    if (!selectedActors.includes(actor)) {
      selectedActors.push(actor);
    }
  }
  return selectedActors;
};

// Generate a set of mock data
export const generateMockData = (count: number): ConflictEvent[] => {
  const startDate = new Date(2020, 0, 1);
  const endDate = new Date(2023, 11, 31);
  
  const events: ConflictEvent[] = [];
  
  for (let i = 0; i < count; i++) {
    const country = africanCountries[randomNumber(0, africanCountries.length - 1)];
    const region = country.regions[randomNumber(0, country.regions.length - 1)];
    const eventType = eventTypes[randomNumber(0, eventTypes.length - 1)] as any;
    
    let fatalities = 0;
    if (eventType === 'Armed Clash') {
      fatalities = randomNumber(5, 50);
    } else if (eventType === 'Violence Against Civilians') {
      fatalities = randomNumber(1, 30);
    } else if (eventType === 'Riot') {
      fatalities = randomNumber(0, 10);
    } else if (eventType === 'Protest') {
      fatalities = randomNumber(0, 5);
    } else {
      fatalities = randomNumber(0, 3);
    }
    
    const date = randomDate(startDate, endDate);
    
    events.push({
      id: `event-${i}`,
      date: date.toISOString().split('T')[0],
      country: country.name,
      region: region,
      eventType: eventType,
      fatalities: fatalities,
      injuries: randomNumber(fatalities, fatalities * 3),
      actors: randomActors(),
      description: `${eventType} in ${region}, ${country.name} involving ${randomActors().join(' and ')}`,
      latitude: randomLatitude(),
      longitude: randomLongitude()
    });
  }
  
  return events;
};

// Export 500 mock events
export const mockConflictEvents = generateMockData(500);

// Function to get events filtered by various criteria
export const getFilteredEvents = (
  events: ConflictEvent[],
  startDate?: string,
  endDate?: string,
  countries?: string[],
  eventTypes?: string[]
): ConflictEvent[] => {
  return events.filter(event => {
    // Date filter
    if (startDate && event.date < startDate) return false;
    if (endDate && event.date > endDate) return false;
    
    // Country filter
    if (countries && countries.length > 0 && !countries.includes(event.country)) return false;
    
    // Event type filter
    if (eventTypes && eventTypes.length > 0 && !eventTypes.includes(event.eventType)) return false;
    
    return true;
  });
};

// Helper functions for analytics
export const getTotalFatalities = (events: ConflictEvent[]): number => {
  return events.reduce((sum, event) => sum + event.fatalities, 0);
};

export const getTotalInjuries = (events: ConflictEvent[]): number => {
  return events.reduce((sum, event) => sum + event.injuries, 0);
};

export const getEventsByCountry = (events: ConflictEvent[]): { country: string; count: number }[] => {
  const countryMap = new Map<string, number>();
  
  events.forEach(event => {
    const current = countryMap.get(event.country) || 0;
    countryMap.set(event.country, current + 1);
  });
  
  return Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count);
};

export const getEventsByType = (events: ConflictEvent[]): { type: string; count: number }[] => {
  const typeMap = new Map<string, number>();
  
  events.forEach(event => {
    const current = typeMap.get(event.eventType) || 0;
    typeMap.set(event.eventType, current + 1);
  });
  
  return Array.from(typeMap.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
};

export const getEventsByMonth = (events: ConflictEvent[]): { month: string; count: number }[] => {
  const monthMap = new Map<string, number>();
  
  events.forEach(event => {
    const date = new Date(event.date);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const current = monthMap.get(monthYear) || 0;
    monthMap.set(monthYear, current + 1);
  });
  
  return Array.from(monthMap.entries())
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));
};
