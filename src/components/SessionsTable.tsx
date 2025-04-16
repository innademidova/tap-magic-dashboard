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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, Trash2, Search, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

const ITEMS_PER_PAGE = 25;

export function SessionsTable({ limit }: { limit?: number }) {
  const { user: currentAuthUser } = useAuth();
  const [sessionToDelete, setSessionToDelete] = useState<PRSession | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    queryKey: ["pr_sessions", limit, currentPage],
    queryFn: async () => {
      const { count } = await supabase
        .from('pr_sessions')
        .select('*', { count: 'exact', head: true });

      if (count !== null) {
        setTotalPages(Math.ceil(count / (limit || ITEMS_PER_PAGE)));
      }

      let query = supabase
        .from('pr_sessions')
        .select('*, users:user_id(first_name, last_name)')
        .order('created_at', { ascending: false });
        
      if (limit) {
        query = query.limit(limit);
      } else {
        const from = (currentPage - 1) * ITEMS_PER_PAGE;
        query = query
          .range(from, from + ITEMS_PER_PAGE - 1)
          .limit(ITEMS_PER_PAGE);
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

  const bulkDeleteMutation = useMutation({
    mutationFn: async (sessionIds: string[]) => {
      const { error } = await supabase
        .from('pr_sessions')
        .delete()
        .in('id', sessionIds);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Selected sessions deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pr_sessions"] });
      setSelectedSessions([]);
      setShowBulkDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(`Failed to delete sessions: ${error.message}`);
    },
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked && sessions) {
      setSelectedSessions(sessions.map(session => session.id));
    } else {
      setSelectedSessions([]);
    }
  };

  const handleSelectSession = (sessionId: string, checked: boolean) => {
    if (checked) {
      setSelectedSessions(prev => [...prev, sessionId]);
    } else {
      setSelectedSessions(prev => prev.filter(id => id !== sessionId));
    }
  };

  const handleBulkDelete = () => {
    if (selectedSessions.length > 0) {
      bulkDeleteMutation.mutate(selectedSessions);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const filteredSessions = sessions?.filter((session) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    
    if (session.session_id.toLowerCase().includes(query)) return true;
    
    if (session.users && 
        `${session.users.first_name} ${session.users.last_name}`.toLowerCase().includes(query)) 
        return true;
    
    const date = formatDate(session.datetime || session.created_at).toLowerCase();
    if (date.includes(query)) return true;
    
    if (session.subject_matter && session.subject_matter.toLowerCase().includes(query)) 
        return true;
    
    return false;
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCreateSession = async () => {
    if (!currentUser) {
      toast.error("User not found");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch(
        "https://devcom.app.n8n.cloud/webhook/9667dbae-dc18-412c-a0c6-4d4071df7949",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: currentUser.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      toast.success("Session creation initiated");
      queryClient.invalidateQueries({ queryKey: ["pr_sessions"] });
    } catch (error) {
      console.error("Error creating session:", error);
      toast.error("Failed to create session");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleCreateSession}
            disabled={isCreating}
            className="whitespace-nowrap"
          >
            {isCreating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Session
              </>
            )}
          </Button>
          {selectedSessions.length > 0 && (
            <Button
              variant="destructive"
              onClick={() => setShowBulkDeleteDialog(true)}
              className="whitespace-nowrap"
            >
              Delete Selected ({selectedSessions.length})
            </Button>
          )}
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={sessions?.length > 0 && selectedSessions.length === sessions.length}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
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
                <TableCell colSpan={6} className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filteredSessions && filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedSessions.includes(session.id)}
                      onCheckedChange={(checked) => handleSelectSession(session.id, checked as boolean)}
                    />
                  </TableCell>
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
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "No matching sessions found." : "No PR sessions found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!limit && totalPages > 1 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem key={index + 1}>
                <PaginationLink
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

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

      <AlertDialog open={showBulkDeleteDialog} onOpenChange={setShowBulkDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Selected Sessions?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {selectedSessions.length} selected PR {selectedSessions.length === 1 ? 'session' : 'sessions'}
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
