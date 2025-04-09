
import { useQuery } from "@tanstack/react-query";
import { Stats } from "@/components/Stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { statistics, users, prSessions } from "@/lib/data";

function Dashboard() {
  // In a real app, these would be actual API calls
  const { data: statsData } = useQuery({
    queryKey: ["statistics"],
    queryFn: () => Promise.resolve(statistics),
    initialData: statistics,
  });

  const { data: recentUsers } = useQuery({
    queryKey: ["recentUsers"],
    queryFn: () => Promise.resolve(users.slice(0, 5)),
    initialData: users.slice(0, 5),
  });

  const { data: upcomingSessions } = useQuery({
    queryKey: ["upcomingSessions"],
    queryFn: () => Promise.resolve(prSessions.filter(s => s.status === "scheduled")),
    initialData: prSessions.filter(s => s.status === "scheduled"),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your Magic On Tap system.
        </p>
      </div>
      
      <Stats
        totalUsers={statsData.totalUsers}
        activeUsers={statsData.activeUsers}
        totalSessions={statsData.totalSessions}
        completedSessions={statsData.completedSessions}
        userGrowthRate={statsData.userGrowthRate}
        sessionCompletionRate={statsData.sessionCompletionRate}
      />
    </div>
  );
}

export default Dashboard;
