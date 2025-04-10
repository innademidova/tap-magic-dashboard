import Agents from "@/components/Agents.tsx";
import { Workflow } from "lucide-react";

const CustomerAgents = () => {

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Workflow className="h-8 w-8 text-primary" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
                    <p className="text-muted-foreground">
                        Manage and interact with your PR agents.
                    </p>
                </div>
            </div>

            <Agents />
        </div>
    );
}

export default CustomerAgents;