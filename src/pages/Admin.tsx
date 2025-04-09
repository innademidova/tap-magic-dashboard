import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UsersTable } from "@/components/UsersTable";
import { SessionsTable } from "@/components/SessionsTable";
import { InvitationsTable } from "@/components/InvitationsTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const AGENTS = [
  {
    id: "pr-researcher",
    name: "PR Researcher",
    description: "AI-powered PR research and analysis agent",
  },
];

function Admin() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'users';
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    // If no tab parameter is present, set the default tab
    if (!searchParams.has('tab')) {
      setSearchParams({ tab: 'users' });
    }
  }, [searchParams, setSearchParams]);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
    setSelectedAgent(null);
  };

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgent(agentId);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Admin</h2>
        <p className="text-muted-foreground">
          Manage users, invitations, and agents in your system.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full md:w-[600px] grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
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
        
        <TabsContent value="agents" className="mt-6">
          {selectedAgent ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedAgent(null)}
                  className="h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h3 className="text-lg font-semibold">
                  {AGENTS.find(agent => agent.id === selectedAgent)?.name}
                </h3>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>PR Sessions</CardTitle>
                  <CardDescription>View and manage PR sessions for this agent.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SessionsTable />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {AGENTS.map((agent) => (
                <Card
                  key={agent.id}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                  onClick={() => handleAgentSelect(agent.id)}
                >
                  <CardHeader>
                    <CardTitle>{agent.name}</CardTitle>
                    <CardDescription>{agent.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Admin;
