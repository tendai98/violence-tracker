
import { useState } from 'react';
import { SidebarProvider, Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { GithubIcon, HelpCircleIcon, MapIcon } from 'lucide-react';
import FilterControls from './FilterControls';
import { ConflictEvent, getFilteredEvents, mockConflictEvents } from '@/data/mockConflictData';

interface DashboardLayoutProps {
  children: React.ReactNode | ((events: ConflictEvent[]) => React.ReactNode);
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [filteredEvents, setFilteredEvents] = useState<ConflictEvent[]>(mockConflictEvents);

  const handleFilterChange = (filters: {
    startDate?: string;
    endDate?: string;
    countries: string[];
    eventTypes: string[];
  }) => {
    const filtered = getFilteredEvents(
      mockConflictEvents, 
      filters.startDate, 
      filters.endDate, 
      filters.countries, 
      filters.eventTypes
    );
    
    setFilteredEvents(filtered);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="px-6 py-5 flex items-center space-x-3">
            <MapIcon className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">Africa Conflict</h1>
              <p className="text-xs text-muted-foreground">Insight Dashboard</p>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-4 py-2">
            <FilterControls onFilterChange={handleFilterChange} />
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border">
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground px-2">Data sources: ACLED and UCDP conflict datasets</p>
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <HelpCircleIcon className="h-4 w-4" />
                </Button>
                <a 
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <GithubIcon className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 h-14 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="flex h-14 items-center px-6">
              <SidebarTrigger />
              <div className="ml-auto flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <span>Last Updated: {new Date().toLocaleDateString()}</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {typeof children === 'function' 
              ? children(filteredEvents) 
              : children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
