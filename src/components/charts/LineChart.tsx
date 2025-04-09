
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LineChartProps {
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

const LineChart = ({ 
  data, 
  color = '#3B82F6', 
  title, 
  height = 300,
  xAxisLabel,
  yAxisLabel
}: LineChartProps) => {
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
        <RechartsLineChart
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
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ fill: color, strokeWidth: 2, r: 6 }}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChart;
