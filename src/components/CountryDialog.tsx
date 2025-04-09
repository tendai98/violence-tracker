
import { useState } from 'react';
import { AlertCircleIcon, CalendarIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { ConflictEvent } from '@/data/mockConflictData';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CountryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  countryName: string;
  events: ConflictEvent[];
}

const CountryDialog = ({ isOpen, onClose, countryName, events }: CountryDialogProps) => {
  const totalEvents = events.length;
  const totalFatalities = events.reduce((sum, event) => sum + event.fatalities, 0);
  const totalInjuries = events.reduce((sum, event) => sum + event.injuries, 0);
  const latestEvent = events.length > 0 ? 
    events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : 
    null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <MapPinIcon className="h-5 w-5 text-primary" />
            {countryName}
          </DialogTitle>
          <DialogDescription>
            Conflict events recorded in this region
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="bg-secondary border-border">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-sm flex items-center gap-1">
                <AlertCircleIcon className="h-4 w-4 text-primary" />
                Incidents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-lg font-bold">{totalEvents}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary border-border">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-sm flex items-center gap-1">
                <UserIcon className="h-4 w-4 text-primary" />
                Fatalities
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-lg font-bold">{totalFatalities}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-secondary border-border">
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-sm flex items-center gap-1">
                <CalendarIcon className="h-4 w-4 text-primary" />
                Latest Event
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-lg font-bold">
                {latestEvent ? new Date(latestEvent.date).toLocaleDateString() : 'N/A'}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-sm font-medium mb-2">Recent Conflict Events</div>
        
        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-3">
            {events.length > 0 ? (
              events
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((event) => (
                  <Card key={event.id} className="bg-secondary/50 border-border">
                    <CardContent className="p-3">
                      <p className="font-medium text-sm mb-1">{event.title}</p>
                      <div className="text-xs text-muted-foreground mb-2">
                        <span className="mr-4">{new Date(event.date).toLocaleDateString()}</span>
                        <span className="mr-4">Type: {event.type}</span>
                        <span>Location: {event.location}</span>
                      </div>
                      <p className="text-xs">{event.description}</p>
                      <div className="flex justify-between mt-2 text-xs">
                        <span className="text-destructive">Fatalities: {event.fatalities}</span>
                        <span className="text-amber-500">Injuries: {event.injuries}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <p className="text-muted-foreground text-center py-4">No events to display</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CountryDialog;
