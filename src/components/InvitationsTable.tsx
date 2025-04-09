
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Invitation } from "@/integrations/supabase/db-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const invitationSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["customer", "admin", "superadmin"], {
    required_error: "Please select a role",
  }),
});

type InvitationFormValues = z.infer<typeof invitationSchema>;

export function InvitationsTable() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: invitations, isLoading: isLoadingInvitations } = useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to fetch invitations");
        throw error;
      }
console.log("data", data)
      return data as unknown as Invitation[];
    },
  });

  const createInvitationMutation = useMutation({
    mutationFn: async (values: InvitationFormValues) => {
      const { data, error } = await supabase
        .from('invitations')
        .insert([{
          email: values.email,
          role: values.role,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      return data as unknown as Invitation;
    },
    onSuccess: () => {
      toast.success("Invitation sent successfully!");
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to send invitation: ${error.message}`);
    },
  });

  const form = useForm<InvitationFormValues>({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: "",
      role: "customer",
    },
  });

  function onSubmit(values: InvitationFormValues) {
    createInvitationMutation.mutate(values);
  }

  const resendInvitation = async (invitation: Invitation) => {
    toast.success(`Invitation resent to ${invitation.email}!`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Accepted</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Expired</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Invitations</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              <span>New Invitation</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send New Invitation</DialogTitle>
              <DialogDescription>
                Invite a new user to join the platform. They will receive an email with a link to register.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="user@example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        The invitation will be sent to this email address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="superadmin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        The user's role determines their access level.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={createInvitationMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {createInvitationMutation.isPending ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Mail className="h-4 w-4" />
                    )}
                    Send Invitation
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingInvitations ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : invitations && invitations.length > 0 ? (
              invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">{invitation.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{invitation.role}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                  <TableCell>
                    {invitation.created_at 
                      ? new Date(invitation.created_at).toLocaleDateString() 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {invitation.expires_at
                      ? new Date(invitation.expires_at).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resendInvitation(invitation)}
                      disabled={invitation.status !== "pending"}
                    >
                      Resend
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No invitations found. Create one to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
