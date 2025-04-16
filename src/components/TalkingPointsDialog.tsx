
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PRTalkingPoint } from "@/integrations/supabase/db-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface TalkingPointsDialogProps {
  open: boolean;
  articleId: string | null;
  onClose: () => void;
}

export function TalkingPointsDialog({
  open,
  articleId,
  onClose,
}: TalkingPointsDialogProps) {
  const [approvedTalkingPoints, setApprovedTalkingPoints] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch talking points related to this article
  const {
    data: talkingPoints,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["talking_points", articleId],
    queryFn: async () => {
      if (!articleId) return [];

      const { data, error } = await supabase
        .from("pr_talking_points")
        .select("*")
        .eq("article_id", articleId)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch talking points");
        throw error;
      }

      return data as PRTalkingPoint[];
    },
    enabled: !!articleId && open,
  });

  const handleCheckboxChange = (talkingPointId: string) => {
    setApprovedTalkingPoints((current) => {
      if (current.includes(talkingPointId)) {
        return current.filter((id) => id !== talkingPointId);
      } else {
        return [...current, talkingPointId];
      }
    });
  };

  const handleSaveApprovals = async () => {
    if (!articleId) return;

    setIsSaving(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // Get approved talking points details
      const approvedPoints = talkingPoints?.filter(tp => 
        approvedTalkingPoints.includes(tp.id)
      ) || [];

      // Call the webhook
      const response = await fetch('https://devcom.app.n8n.cloud/webhook/23607c30-eebb-4f88-b9ae-333f065394bd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article_id: articleId,
          user_id: user.id,
          approved_talking_points: approvedPoints,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to trigger webhook');
      }

      toast.success("Talking points approvals saved successfully");
      onClose();
    } catch (error) {
      console.error('Error saving approvals:', error);
      toast.error("Failed to save talking points approvals");
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Talking Points</DialogTitle>
          <DialogDescription>
            Review and manage talking points for this article
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">
            Error loading talking points
          </div>
        ) : talkingPoints && talkingPoints.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Approve</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {talkingPoints.map((talkingPoint) => (
                  <TableRow key={talkingPoint.id}>
                    <TableCell className="whitespace-normal">{talkingPoint.content}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatDate(talkingPoint.created_at)}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={approvedTalkingPoints.includes(talkingPoint.id)}
                        onCheckedChange={() => handleCheckboxChange(talkingPoint.id)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end mt-4">
              <Button 
                onClick={handleSaveApprovals} 
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Approvals'
                )}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-center py-8 text-muted-foreground">
            No talking points found for this article.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
