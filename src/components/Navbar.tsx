import { useAuth } from "@/lib/auth-context";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Settings, Workflow } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const { data: userProfile } = useQuery({
    queryKey: ["user", user?.id, location.pathname],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('first_name, role')
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
  const firstLetter = userProfile?.first_name?.[0]?.toUpperCase() || '';

  return (
    <div className="h-16 border-b flex items-center px-6 justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Magic On Tap {isAdmin ? 'Admin' : 'Agents'}</h1>
        <Link 
          to={isAdmin ? "/admin" : "/agents"} 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {isAdmin ? (
            <>
              <Settings className="h-4 w-4" />
              <span>Admin</span>
            </>
          ) : (
            <>
              <Workflow className="h-4 w-4" />
              <span>Agents</span>
            </>
          )}
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
            <div className={cn(
              "h-8 w-8 rounded-full flex items-center justify-center",
              "bg-primary/10 text-primary font-medium",
              !firstLetter && "border border-dashed border-muted-foreground"
            )}>
              {firstLetter}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              {user?.email}
            </div>
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                <User className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer">
              <LogOut className="h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
