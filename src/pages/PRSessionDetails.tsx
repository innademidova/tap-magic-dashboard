
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PRSession, PRArticle, User } from "@/integrations/supabase/db-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCw, FileText, Info } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SessionWithUser extends PRSession {
  users: User;
}

function PRSessionDetails() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [localArticles, setLocalArticles] = useState<PRArticle[]>([]);

  const {
    data: session,
    isLoading: isLoadingSession,
    error: sessionError,
  } = useQuery({
    queryKey: ["pr_session", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pr_sessions")
        .select("*, users:user_id(*)")
        .eq("id", sessionId)
        .single();

      if (error) {
        toast.error("Failed to fetch session details");
        throw error;
      }

      return data as unknown as SessionWithUser;
    },
    enabled: !!sessionId,
  });

  const {
    data: articles,
    isLoading: isLoadingArticles,
    error: articlesError,
  } = useQuery({
    queryKey: ["pr_articles", sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pr_articles")
        .select("*")
        .eq("session_id", sessionId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch related articles");
        throw error;
      }

      return data as PRArticle[];
    },
    enabled: !!sessionId,
  });

  // Update local articles when the query data changes
  useEffect(() => {
    if (articles) {
      setLocalArticles(articles);
    }
  }, [articles]);

  const updateArticleStatusMutation = useMutation({
    mutationFn: async ({ articleId, status }: { articleId: string; status: string }) => {
      const { error } = await supabase
        .from('pr_articles')
        .update({ status })
        .eq('id', articleId);

      if (error) throw error;

      // Only trigger webhook when status is changed to 'approved'
      if (status === 'approved') {
        try {
          const webhookResponse = await fetch('https://devcom.app.n8n.cloud/webhook/8a6de0c8-3694-48be-a506-1ddee6b9b4d0', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ article_id: articleId,
            session_id: sessionId }),
          });
          
          if (!webhookResponse.ok) {
            throw new Error('Webhook trigger failed');
          }
        } catch (webhookError) {
          console.error('Webhook error:', webhookError);
          toast.error('Failed to trigger the next workflow');
          return;
        }
      }
    },
    onSuccess: (_, { articleId, status }) => {
      setLocalArticles(prevArticles => 
        prevArticles.map(article => 
          article.id === articleId 
            ? { ...article, status } 
            : article
        )
      );
      toast.success("Article status updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update article status: ${error.message}`);
    },
  });

  const handleApproveChange = (articleId: string, checked: boolean) => {
    updateArticleStatusMutation.mutate({
      articleId,
      status: checked ? 'approved' : 'draft'
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  if (sessionError || articlesError) {
    toast.error("Error loading data");
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold tracking-tight">Error</h2>
        <p className="text-muted-foreground">
          Failed to load session details. Please try again.
        </p>
        <Button onClick={() => navigate("/admin")}>Back to Admin</Button>
      </div>
    );
  }

  if (isLoadingSession || isLoadingArticles) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin?tab=agents&agent=pr-researcher")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">PR Session Details</h2>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>Basic details about this PR session</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Session ID
              </p>
              <p>{session?.session_id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <p>{formatDate(session?.created_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Details about the user</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p>
                {session?.users
                  ? `${session.users.first_name} ${session.users.last_name}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{session?.users?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Industry
              </p>
              <p>{session?.industry || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Subject Matter
              </p>
              <p>{session?.subject_matter || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Audience
              </p>
              <p>{session?.audience || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Writing Style
              </p>
              <p>{session?.writing_style || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Related Articles</CardTitle>
          <CardDescription>
            Articles associated with this session
          </CardDescription>
        </CardHeader>
        <CardContent>
          {localArticles && localArticles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      Approve
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Approval of the article will trigger the next step: generation of talking points.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {localArticles.map((article) => (
                  <TableRow key={article.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell 
                      className="font-medium"
                      onClick={() => navigate(`/article/${article.id}`)}
                    >
                      {article.title}
                    </TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>
                      <Button
                        variant="link"
                        className="p-0 h-auto"
                        onClick={() => window.open(article.url, "_blank")}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                    <TableCell>{article.status}</TableCell>
                    <TableCell>{formatDate(article.created_at)}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={article.status === 'approved'}
                        onCheckedChange={(checked) => handleApproveChange(article.id, checked as boolean)}
                        disabled={updateArticleStatusMutation.isPending}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              No articles found for this session.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PRSessionDetails;
