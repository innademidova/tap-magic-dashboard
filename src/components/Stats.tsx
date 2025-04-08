
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Users, Calendar } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
}

function StatCard({ title, value, description, icon, trend }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-1">
            {trend.positive ? (
              <ArrowUp className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${trend.positive ? "text-green-500" : "text-red-500"}`}>
              {trend.value}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatsProps {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  completedSessions: number;
  userGrowthRate: number;
  sessionCompletionRate: number;
}

export function Stats({
  totalUsers,
  activeUsers,
  totalSessions,
  completedSessions,
  userGrowthRate,
  sessionCompletionRate,
}: StatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={totalUsers}
        description={`${activeUsers} active users`}
        icon={<Users className="h-4 w-4" />}
        trend={{ value: userGrowthRate, positive: true }}
      />
      <StatCard
        title="Active Users"
        value={activeUsers}
        description={`${Math.round((activeUsers / totalUsers) * 100)}% of total users`}
        icon={<Users className="h-4 w-4" />}
      />
      <StatCard
        title="Total PR Sessions"
        value={totalSessions}
        description={`${completedSessions} completed sessions`}
        icon={<Calendar className="h-4 w-4" />}
      />
      <StatCard
        title="PR Session Completion"
        value={`${sessionCompletionRate}%`}
        description={`${completedSessions}/${totalSessions} sessions completed`}
        icon={<Calendar className="h-4 w-4" />}
      />
    </div>
  );
}
