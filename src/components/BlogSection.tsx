
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PRBlog } from "@/integrations/supabase/db-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BlogSectionProps {
  articleId: string;
}

export function BlogSection({ articleId }: BlogSectionProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

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
        "https://devcom.app.n8n.cloud/webhook/23607c30-eebb-4f88-b9ae-333f065394bd",
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

  const handleStartEdit = () => {
    if (blog) {
      setEditTitle(blog.title);
      setEditContent(blog.content);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!blog) return;

    try {
      const { error } = await supabase
        .from("pr_blogs")
        .update({
          title: editTitle,
          content: editContent,
        })
        .eq("id", blog.id);

      if (error) throw error;

      toast.success("Blog updated successfully");
      queryClient.invalidateQueries({ queryKey: ["blog", articleId] });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating blog:", error);
      toast.error("Failed to update blog");
    }
  };

  const handleDelete = async () => {
    if (!blog) return;

    try {
      const { error } = await supabase
        .from("pr_blogs")
        .delete()
        .eq("id", blog.id);

      if (error) throw error;

      toast.success("Blog deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["blog", articleId] });
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog");
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
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Generated Blog</p>
            <CardTitle>{blog.title}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleSaveEdit}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleStartEdit}>
                  <Pencil className="h-4 w-4" />
                </Button>
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
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Blog title"
                />
              </div>
              <div>
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Blog content"
                  className="min-h-[200px]"
                />
              </div>
            </div>
          ) : (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
