
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PRSession } from "@/integrations/supabase/db-types";
import { useAuth } from "@/lib/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, Edit, Trash2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
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

export function SessionsTable({ limit }: { limit?: number }) {
  const { user: currentAuthUser } = useAuth();
  const [sessionToDelete, setSessionToDelete] = useState<PRSession | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser", currentAuthUser?.id],
    queryFn: async () => {
      if (!currentAuthUser?.id) return null;
      
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', currentAuthUser.id)
        .single();

      if (error) {
        console.error("Failed to fetch current user:", error);
        return null;
      }

      return data;
    },
    enabled: !!currentAuthUser?.id,
  });

  const { data: sessions, isLoading } = useQuery({
    queryKey: ["pr_sessions", limit],
    queryFn: async () => {
      let query = supabase
        .from('pr_sessions')
        .select('*, users:user_id(first_name, last_name)')
        .order('created_at', { ascending: false });
        
      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        toast.error("Failed to fetch PR sessions");
        throw error;
      }

      return data as unknown as (PRSession & { users: { first_name: string, last_name: string } })[];
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('pr_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Session deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pr_sessions"] });
      setSessionToDelete(null);
    },
    onError: (error) => {
      toast.error(`Failed to delete session: ${error.message}`);
    },
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  // Filter sessions based on search query
  const filteredSessions = sessions?.filter((session) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    
    // Search in session ID
    if (session.session_id.toLowerCase().includes(query)) return true;
    
    // Search in user name
    if (session.users && 
        `${session.users.first_name} ${session.users.last_name}`.toLowerCase().includes(query)) 
        return true;
    
    // Search in date
    const date = formatDate(session.datetime || session.created_at).toLowerCase();
    if (date.includes(query)) return true;
    
    // Search in subject matter
    if (session.subject_matter && session.subject_matter.toLowerCase().includes(query)) 
        return true;
    
    return false;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search sessions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Subject Matter</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filteredSessions && filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">{session.session_id}</TableCell>
                  <TableCell>
                    {session.users ? `${session.users.first_name} ${session.users.last_name}` : "Unknown User"}
                  </TableCell>
                  <TableCell>{formatDate(session.datetime || session.created_at)}</TableCell>
                  <TableCell>{session.subject_matter || "N/A"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" title="View Session" asChild>
                      <Link to={`/pr-session/${session.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" title="Edit Session">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {currentUser?.role === 'admin' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Delete Session"
                        onClick={() => setSessionToDelete(session)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No matching sessions found." : "No PR sessions found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!sessionToDelete} onOpenChange={() => setSessionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the PR session
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => sessionToDelete && deleteSessionMutation.mutate(sessionToDelete.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
