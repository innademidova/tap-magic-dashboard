
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable, SessionsTable } from "@/components/DataTable";
import { users, prSessions } from "@/lib/data";

function Admin() {
  const [activeTab, setActiveTab] = useState("users");
  
  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => Promise.resolve(users),
    initialData: users,
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => Promise.resolve(prSessions),
    initialData: prSessions,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin</h2>
        <p className="text-muted-foreground">
          Manage users and PR sessions in your system.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="sessions">PR Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Users Management</CardTitle>
              <CardDescription>View and manage all users in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable users={usersData} />
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
              <SessionsTable sessions={sessionsData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Admin;
