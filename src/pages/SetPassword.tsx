import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function SetPassword() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to dashboard if not logged in
  if (!user) {
    navigate('/signin');
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
          <CardDescription className="text-center">
            Update your account password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm 
            onSuccess={() => navigate('/')}
            showCancelButton={false}
          />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            variant="link" 
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SetPassword;
