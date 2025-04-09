
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  colors?: string[];
  title?: string;
  height?: number;
}

const defaultColors = [
  '#3B82F6', // blue-500
  '#F97316', // orange-500
  '#EF4444', // red-500
  '#10B981', // emerald-500
  '#6366F1', // indigo-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#F59E0B', // amber-500
];

const DonutChart = ({ data, colors = defaultColors, title, height = 300 }: DonutChartProps) => {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] bg-card rounded-lg border border-border">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  // Map colors to data
  const colorMap = data.map((entry, index) => ({
    ...entry,
    color: colors[index % colors.length],
  }));

  return (
    <div className="h-full w-full">
      {title && <h3 className="text-sm font-medium mb-2 text-center">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={colorMap}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="80%"
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {colorMap.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => [`${value}`, 'Count']}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.375rem'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
