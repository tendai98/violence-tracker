
import { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricCard = ({ title, value, description, icon, className, trend }: MetricCardProps) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && <CardDescription>{description}</CardDescription>}
        {trend && (
          <div className={cn(
            "text-xs font-medium mt-1 flex items-center",
            trend.isPositive ? "text-emerald-500" : "text-red-500"
          )}>
            <span className="mr-1">
              {trend.isPositive ? '↑' : '↓'}
            </span>
            {trend.value}%
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MetricCard;
