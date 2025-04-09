
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapIcon } from 'lucide-react';
import SvgAfricaMap from '@/components/SvgAfricaMap';
import { mockConflictEvents } from '@/data/mockConflictData';
import CountryDialog from '@/components/CountryDialog';

const Index = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedEvents, setSelectedEvents] = useState(mockConflictEvents.slice(0, 10));

  const handleCountryClick = (countryCode: string) => {
    // Filter events for this country
    const countryEvents = mockConflictEvents.filter(
      event => event.country.substring(0, 2).toUpperCase() === countryCode
    );
    
    if (countryEvents.length > 0) {
      setSelectedEvents(countryEvents);
      setSelectedCountry(countryEvents[0].country);
      setDialogOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapIcon className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold tracking-tight">ViolenceTracker</h1>
                <p className="text-xs text-muted-foreground">Africa Conflict Monitor</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl font-bold tracking-tight">
                Tracking Political Violence Across Africa
              </h1>
              <p className="text-lg text-muted-foreground">
                ViolenceTracker provides comprehensive, real-time monitoring of political violence 
                and protest events across the African continent.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link to="/dashboard">Explore Dashboard</Link>
                </Button>
                <Button variant="outline" size="lg">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                    View Source
                  </a>
                </Button>
              </div>
            </div>
            <div className="h-[400px] border border-border rounded-lg overflow-hidden">
              <SvgAfricaMap events={mockConflictEvents.slice(0, 50)} onCountryClick={handleCountryClick} />
            </div>
          </div>
        </section>

        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>About the Data</CardTitle>
              <CardDescription>
                Our data is sourced from leading conflict monitoring organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                ViolenceTracker aggregates and processes data from the Armed Conflict Location & Event Data Project (ACLED) 
                and the Uppsala Conflict Data Program (UCDP), two of the world's leading conflict monitoring initiatives.
              </p>
              <p>
                The data includes information on political violence, protests, riots, and other significant events 
                across the African continent, with details on location, date, involved actors, and casualties.
              </p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Note: This project currently uses mock data for demonstration purposes only.
              </p>
            </CardFooter>
          </Card>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <MapIcon className="h-5 w-5 text-primary" />
              <span className="font-semibold">ViolenceTracker</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ViolenceTracker. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Dialog for country details */}
      <CountryDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        countryName={selectedCountry}
        events={selectedEvents}
      />
    </div>
  );
};

export default Index;
