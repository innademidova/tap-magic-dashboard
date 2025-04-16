
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PRBlog } from "@/integrations/supabase/db-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check } from "lucide-react";
import { toast } from "sonner";

interface BlogSectionProps {
  articleId: string;
}

export function BlogSection({ articleId }: BlogSectionProps) {
  const [isApproving, setIsApproving] = useState(false);

  const { data: blog, isLoading } = useQuery({
    queryKey: ["blog", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pr_blogs")
        .select("*")
        .eq("article_id", articleId)
        .maybeSingle();

      if (error) {
        toast.error("Failed to fetch blog");
        throw error;
      }

      return data as PRBlog;
    },
    enabled: !!articleId,
  });

  const handleApproveBlog = async () => {
    if (!articleId) return;

    setIsApproving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const response = await fetch(
        "https://devcom.app.n8n.cloud/webhook-test/23607c30-eebb-4f88-b9ae-333f065394bd",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            article_id: articleId,
            user_id: user.id,
            approved_blog: blog,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to trigger webhook");
      }

      toast.success("Blog approved successfully");
    } catch (error) {
      console.error("Error approving blog:", error);
      toast.error("Failed to approve blog");
    } finally {
      setIsApproving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!blog) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Blog</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No blog found for this article.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{blog.title}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleApproveBlog}
          disabled={isApproving}
        >
          {isApproving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Approve Blog
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-wrap">{blog.content}</div>
      </CardContent>
    </Card>
  );
}
