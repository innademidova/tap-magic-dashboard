
import { useQuery } from "@tanstack/react-query";
import { Stats } from "@/components/Stats";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        // Get total users count
        const { count: totalUsers, error: usersError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });

        if (usersError) throw usersError;

        // Get users who signed in during the last 24 hours
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

        // Query the auth.users table for recent sign-ins
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
          filters: {
            gt: {
              last_sign_in_at: twentyFourHoursAgo.toISOString(),
            },
          },
        });

        if (authError) {
          console.error("Error fetching auth users:", authError);
          // Fallback to using the users table created_at as before
          const { data: recentUsers, error: recentUsersError } = await supabase
              .from('users')
              .select('*')
              .gte('created_at', twentyFourHoursAgo.toISOString());

          if (recentUsersError) throw recentUsersError;
          
          var recentUsersCount = recentUsers?.length || 0;
        } else {
          var recentUsersCount = authData?.users?.length || 0;
        }

        // Get total sessions count
        const { count: totalSessions, error: sessionsError } = await supabase
            .from('pr_sessions')
            .select('*', { count: 'exact', head: true });

        if (sessionsError) throw sessionsError;

        // Get sessions created in the last 24 hours
        const { data: recentSessions, error: recentSessionsError } = await supabase
            .from('pr_sessions')
            .select('*')
            .gte('created_at', twentyFourHoursAgo.toISOString());

        if (recentSessionsError) throw recentSessionsError;

        return {
          totalUsers: totalUsers || 0,
          recentUsers: recentUsersCount,
          totalSessions: totalSessions || 0,
          recentSessions: recentSessions?.length || 0
        };
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast.error("Failed to load dashboard statistics");
        return {
          totalUsers: 0,
          recentUsers: 0,
          totalSessions: 0,
          recentSessions: 0
        };
      }
    },
  });

  return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your Magic On Tap system.
          </p>
        </div>

        {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="animate-pulse">
                <CardHeader className="h-20 bg-muted/20"></CardHeader>
                <CardContent className="h-28 bg-muted/10"></CardContent>
              </Card>
              <Card className="animate-pulse">
                <CardHeader className="h-20 bg-muted/20"></CardHeader>
                <CardContent className="h-28 bg-muted/10"></CardContent>
              </Card>
            </div>
        ) : (
            <Stats
                totalUsers={statsData?.totalUsers || 0}
                recentUsers={statsData?.recentUsers || 0}
                totalSessions={statsData?.totalSessions || 0}
                recentSessions={statsData?.recentSessions || 0}
            />
        )}
      </div>
  );
}

export default Dashboard;
