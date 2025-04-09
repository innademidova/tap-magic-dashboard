
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "@/components/UsersTable";
import { SessionsTable } from "@/components/SessionsTable";
import { InvitationsTable } from "@/components/InvitationsTable";

function Admin() {
  const [activeTab, setActiveTab] = useState("users");
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin</h2>
        <p className="text-muted-foreground">
          Manage users, invitations, and PR sessions in your system.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="sessions">PR Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>View and manage all users in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invitations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Invitations Management</CardTitle>
              <CardDescription>Send and manage invitations to new users.</CardDescription>
            </CardHeader>
            <CardContent>
              <InvitationsTable />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>PR Sessions Management</CardTitle>
              <CardDescription>View and manage all PR sessions in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <SessionsTable />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Admin;
