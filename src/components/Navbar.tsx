
import { useAuth } from "@/lib/auth-context";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { User, LogOut, Key } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function Navbar() {
  const { user, signOut } = useAuth();

  const { data: userProfile } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('first_name')
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

  return (
    <div className="h-16 border-b flex items-center px-6 justify-between">
      <h1 className="text-xl font-semibold">Magic On Tap Admin</h1>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="text-sm flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
            <User className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            <span className="text-muted-foreground hover:text-foreground">
              {userProfile?.first_name || user?.email || 'Not signed in'}
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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
