
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
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Latest users who joined the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming PR Sessions</CardTitle>
            <CardDescription>Sessions scheduled for the future</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{session.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.participants} participants · {session.duration}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(session.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
