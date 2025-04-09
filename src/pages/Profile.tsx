
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Edit } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const { data: userProfile, isLoading } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', user.id)
        .single();
      
      if (error) {
        toast.error("Failed to load user profile");
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
        <Button className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">First Name</p>
            <p className="text-base">{userProfile?.first_name || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Last Name</p>
            <p className="text-base">{userProfile?.last_name || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Email</p>
            <p className="text-base">{userProfile?.email || user?.email || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Phone</p>
            <p className="text-base">{userProfile?.phone || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Role</p>
            <p className="text-base">{userProfile?.role || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Industry</p>
            <p className="text-base">{userProfile?.industry || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Subject Matter</p>
            <p className="text-base">{userProfile?.subject_matter || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Unique Selling Proposition</p>
            <p className="text-base">{userProfile?.usp || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Target Audience</p>
            <p className="text-base">{userProfile?.audience || "-"}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none text-muted-foreground">Writing Style</p>
            <p className="text-base">{userProfile?.writing_style || "-"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{userProfile?.bio || "-"}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          {userProfile?.keywords && userProfile.keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {userProfile.keywords.map((keyword, index) => (
                <span key={index} className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                  {keyword}
                </span>
              ))}
            </div>
          ) : (
            <p>-</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
