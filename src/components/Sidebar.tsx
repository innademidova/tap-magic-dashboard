import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Settings, Menu, Workflow } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
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
  
  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="h-5 w-5" /> },
    { 
      name: isAdmin ? 'Admin' : 'Agents', 
      path: isAdmin ? '/admin' : '/agents', 
      icon: isAdmin ? <Settings className="h-5 w-5" /> : <Workflow className="h-5 w-5" />
    }
  ];

  return (
    <div className={cn(
      "bg-sidebar text-sidebar-foreground min-h-screen transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between h-16 px-4">
        {!collapsed && (
          <div className="text-xl font-bold text-white">Magic On Tap</div>
        )}
        <button 
          onClick={toggleCollapse} 
          className="ml-auto p-2 rounded-md hover:bg-sidebar-accent"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="p-2 flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
              isActive 
                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
