import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { PasswordChangeForm } from "@/components/PasswordChangeForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ResetPassword = () => {
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
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Please enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordChangeForm 
            onSuccess={() => navigate('/')}
            showCancelButton={false}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPassword;
