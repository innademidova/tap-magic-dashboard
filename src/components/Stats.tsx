
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar } from "lucide-react";
import {useAuth} from "@/lib/auth-context.tsx";
import {useQuery} from "@tanstack/react-query";
import {supabase} from "@/integrations/supabase/client.ts";

interface StatsProps {
  totalUsers: number;
  recentUsers: number;
  totalSessions: number;
  recentSessions: number;
}

export function Stats({
  totalUsers,
  recentUsers,
  totalSessions,
  recentSessions,
}: StatsProps) {
  const { user } = useAuth();

  const { data: userProfile } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('auth_id', user.id)
          .single();

      if (error) {
        console.error("Failed to load user profile:", error);
        return null;
      }

      return data;
    },
    enabled: !!user?.id,
  });

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'superadmin';
  
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">PR Sessions</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSessions}</div>
          <p className="text-xs text-muted-foreground">
            {recentSessions} in the last 24 hours
          </p>
        </CardContent>
      </Card>

      {isAdmin &&
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalUsers}</div>
          <p className="text-xs text-muted-foreground">
            {recentUsers} in the last 24 hours
          </p>
        </CardContent>
      </Card>}
    </div>
  );
}
