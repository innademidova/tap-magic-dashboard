
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // In the future, this would handle sign-out logic
    navigate("/signin");
  };

  return (
    <div className="h-16 border-b flex items-center px-6 justify-between">
      <h1 className="text-xl font-semibold">Magic On Tap Admin</h1>
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          admin@magicrontap.com
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          Sign out
        </Button>
      </div>
    </div>
  );
}
