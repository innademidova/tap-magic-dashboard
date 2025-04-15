
import { useQuery } from "@tanstack/react-query";
import { Stats } from "@/components/Stats";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function Dashboard() {
  const { user: currentAuthUser } = useAuth();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser", currentAuthUser?.id],
    queryFn: async () => {
      if (!currentAuthUser?.id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', currentAuthUser.id)
        .single();

      if (error) {
        console.error("Failed to fetch current user:", error);
        return null;
      }

      return data;
    },
    enabled: !!currentAuthUser?.id,
  });

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      try {
        let stats: any = {};
        
        // Only fetch user stats for admin/superadmin
        if (currentUser?.role === 'admin' || currentUser?.role === 'superadmin') {
          const { count: totalUsers, error: usersError } = await supabase
            .from('users')
            .select('*', { count: 'exact', head: true });
          
          if (usersError) throw usersError;

          const twentyFourHoursAgo = new Date();
          twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
          
          const { data: recentUsers, error: recentUsersError } = await supabase
            .from('users')
            .select('*')
            .gte('created_at', twentyFourHoursAgo.toISOString());
          
          if (recentUsersError) throw recentUsersError;

          stats.totalUsers = totalUsers || 0;
          stats.recentUsers = recentUsers?.length || 0;
        }

        // Fetch session stats for all users
        const { count: totalSessions, error: sessionsError } = await supabase
          .from('pr_sessions')
          .select('*', { count: 'exact', head: true });
        
        if (sessionsError) throw sessionsError;

        const { data: recentSessions, error: recentSessionsError } = await supabase
          .from('pr_sessions')
          .select('*')
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
        
        if (recentSessionsError) throw recentSessionsError;

        stats.totalSessions = totalSessions || 0;
        stats.recentSessions = recentSessions?.length || 0;

        return stats;
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your Magic On Tap system.
          </p>
        </div>
        {currentUser?.role === 'customer' && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create new PR session
          </Button>
        )}
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
          totalUsers={currentUser?.role === 'customer' ? undefined : (statsData?.totalUsers || 0)}
          recentUsers={currentUser?.role === 'customer' ? undefined : (statsData?.recentUsers || 0)}
          totalSessions={statsData?.totalSessions || 0}
          recentSessions={statsData?.recentSessions || 0}
        />
      )}
    </div>
  );
}

export default Dashboard;
