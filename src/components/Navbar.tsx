
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

export function Navbar() {
  const { user, signOut } = useAuth();

  return (
    <div className="h-16 border-b flex items-center px-6 justify-between">
      <h1 className="text-xl font-semibold">Magic On Tap Admin</h1>
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {user?.email || 'Not signed in'}
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
