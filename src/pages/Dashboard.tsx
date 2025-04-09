
import { useCallback } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ConflictMap from '@/components/ConflictMap';
import SvgAfricaMap from '@/components/SvgAfricaMap';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricCard from '@/components/MetricCard';
import BarChart from '@/components/charts/BarChart';
import LineChart from '@/components/charts/LineChart';
import DonutChart from '@/components/charts/DonutChart';
import { 
  ConflictEvent, 
  getTotalFatalities, 
  getTotalInjuries, 
  getEventsByCountry, 
  getEventsByType, 
  getEventsByMonth,
  mockConflictEvents
} from '@/data/mockConflictData';
import { AlertCircleIcon, BarChartIcon, FlameIcon, MapIcon, UserIcon } from 'lucide-react';

const Dashboard = () => {
  const renderDashboard = useCallback((events: ConflictEvent[]) => {
    // Calculate metrics
    const totalEvents = events.length;
    const totalFatalities = getTotalFatalities(events);
    const totalInjuries = getTotalInjuries(events);
    
    // Get top countries
    const countriesData = getEventsByCountry(events)
      .slice(0, 5)
      .map(({ country, count }) => ({ name: country, value: count }));
    
    // Get event type breakdown
    const eventTypesData = getEventsByType(events)
      .map(({ type, count }) => ({ name: type, value: count }));
    
    // Get events by month
    const monthlyData = getEventsByMonth(events)
      .map(({ month, count }) => {
        // Format the month for display (YYYY-MM to MMM YYYY)
        const [year, monthNum] = month.split('-');
        const date = new Date(parseInt(year), parseInt(monthNum) - 1);
        const formattedMonth = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        
        return { name: formattedMonth, value: count };
      });
    
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight">ViolenceTracker: Political Violence Monitoring in Africa</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Incidents"
            value={totalEvents.toLocaleString()}
            description="Conflict events in selected period"
            icon={<AlertCircleIcon />}
          />
          <MetricCard
            title="Fatalities"
            value={totalFatalities.toLocaleString()}
            description="Lives lost in selected incidents"
            icon={<UserIcon />}
          />
          <MetricCard
            title="Injuries"
            value={totalInjuries.toLocaleString()}
            description="People injured in selected incidents"
            icon={<FlameIcon />}
          />
          <MetricCard
            title="Countries Affected"
            value={getEventsByCountry(events).length}
            description="Countries with recorded incidents"
            icon={<MapIcon />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardContent className="p-4">
              <Tabs defaultValue="svg-map">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Geographic Visualization</h2>
                  <TabsList>
                    <TabsTrigger value="svg-map">SVG Map</TabsTrigger>
                    <TabsTrigger value="interactive-map">Interactive Map</TabsTrigger>
                    <TabsTrigger value="countries">Countries</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="svg-map" className="m-0">
                  <div className="h-[500px]">
                    <SvgAfricaMap events={events} />
                  </div>
                </TabsContent>
                <TabsContent value="interactive-map" className="m-0">
                  <div className="h-[500px]">
                    <ConflictMap events={events} />
                  </div>
                </TabsContent>
                <TabsContent value="countries" className="m-0">
                  <div className="h-[500px]">
                    <BarChart 
                      data={countriesData}
                      color="#F97316"
                      height={480}
                      title="Top Countries by Incident Count"
                      xAxisLabel="Country"
                      yAxisLabel="Incidents"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Event Type Breakdown</h2>
              <div className="h-[500px]">
                <DonutChart 
                  data={eventTypesData}
                  height={480}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-4">Trend Over Time</h2>
            <div className="h-[300px]">
              <LineChart 
                data={monthlyData}
                color="#F97316"
                height={280}
                xAxisLabel="Month"
                yAxisLabel="Incidents"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="text-xs text-muted-foreground mt-8 pt-4 border-t border-border">
          <p>Data sources: Armed Conflict Location & Event Data Project (ACLED) and Uppsala Conflict Data Program (UCDP)</p>
          <p>Note: This dashboard presents mock data for demonstration purposes only.</p>
        </div>
      </div>
    );
  }, []);

  return (
    <DashboardLayout>
      {renderDashboard(mockConflictEvents)}
    </DashboardLayout>
  );
};

export default Dashboard;
