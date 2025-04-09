
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { PRSession } from "@/integrations/supabase/db-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Eye, Edit } from "lucide-react";
import { Link } from "react-router-dom";

export function SessionsTable() {
  const { data: sessions, isLoading } = useQuery({
    queryKey: ["pr_sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pr_sessions')
        .select('*, users:user_id(first_name, last_name)')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Failed to fetch PR sessions");
        throw error;
      }

      return data as unknown as (PRSession & { users: { first_name: string, last_name: string } })[];
    },
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4">
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
            ) : sessions && sessions.length > 0 ? (
              sessions.map((session) => (
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No PR sessions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
