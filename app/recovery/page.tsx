import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecoveryVisualization } from "@/components/recovery-visualization";

export default function DeadlockRecoveryPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Deadlock Recovery</h1>

      <Tabs defaultValue="process-termination">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="process-termination">
            Process Termination
          </TabsTrigger>
          <TabsTrigger value="resource-preemption">
            Resource Preemption
          </TabsTrigger>
        </TabsList>

        <TabsContent value="process-termination" className="mt-6">
          <div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="mx-auto">
                    Process Termination Recovery
                  </CardTitle>
                  <CardDescription className="mx-auto">
                    Visualize how terminating processes can resolve deadlocks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecoveryVisualization type="process-termination" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="resource-preemption" className="mt-6">
          <div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="mx-auto">
                    Resource Preemption Recovery
                  </CardTitle>
                  <CardDescription className="mx-auto">
                    Visualize how preempting resources can resolve deadlocks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecoveryVisualization type="resource-preemption" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>About Deadlock Recovery</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Deadlock recovery is a strategy where the system allows deadlocks to
            occur but has mechanisms to recover from them when they are
            detected. Recovery methods include process termination and resource
            preemption, each with their own advantages and disadvantages in
            terms of overhead and system impact.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
