
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  color?: string;
  title?: string;
  height?: number;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

const BarChart = ({ 
  data, 
  color = '#3B82F6', 
  title, 
  height = 300,
  xAxisLabel,
  yAxisLabel
}: BarChartProps) => {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] bg-card rounded-lg border border-border">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Format the data for recharts
  const formattedData = data.map(item => ({
    name: item.name,
    value: item.value
  }));

  return (
    <div className="h-full w-full">
      {title && <h3 className="text-sm font-medium mb-2 text-center">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 25,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            label={xAxisLabel ? { value: xAxisLabel, position: 'insideBottom', offset: -15, fill: 'hsl(var(--muted-foreground))' } : undefined}
          />
          <YAxis 
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={{ stroke: 'hsl(var(--border))' }}
            label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' } : undefined}
          />
          <Tooltip
            formatter={(value: any) => [`${value}`, 'Count']}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.375rem'
            }}
          />
          <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart;
