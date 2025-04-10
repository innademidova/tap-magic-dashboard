import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { SessionsTable } from "@/components/SessionsTable.tsx";
import { useState } from "react";


const AGENTS = [
    {
        id: "pr-researcher",
        name: "PR Researcher",
        description: "PR research agent",
    },
];
export const Agents = () => {
    const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
    const handleAgentSelect = (agentId: string) => {
        setSelectedAgent(agentId);
    };

    return <div>
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
    </div>
}

export default Agents;