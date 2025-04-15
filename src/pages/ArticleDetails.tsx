
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PRArticle } from "@/integrations/supabase/db-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, RefreshCw, FileText, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { TalkingPointsDialog } from "@/components/TalkingPointsDialog";
import { useState } from "react";

function ArticleDetails() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const [isTalkingPointsOpen, setIsTalkingPointsOpen] = useState(false);

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pr_articles")
        .select("*")
        .eq("id", articleId)
        .single();

      if (error) {
        toast.error("Failed to fetch article details");
        throw error;
      }

      return data as PRArticle;
    },
    enabled: !!articleId,
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Article Details</h2>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{article?.title}</CardTitle>
          <CardDescription>Article Information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Author</p>
              <p>{article?.author}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <p>{formatDate(article?.created_at)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              <p>{article?.status}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">URL</p>
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => article?.url && window.open(article.url, "_blank")}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Source
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Content
            </p>
            <div className="whitespace-pre-wrap bg-muted p-4 rounded-md">
              {article?.content}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={() => setIsTalkingPointsOpen(true)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              View Talking Points
            </Button>
          </div>
        </CardContent>
      </Card>

      {articleId && (
        <TalkingPointsDialog
          open={isTalkingPointsOpen}
          articleId={articleId}
          onClose={() => setIsTalkingPointsOpen(false)}
        />
      )}
    </div>
  );
}

export default ArticleDetails;
