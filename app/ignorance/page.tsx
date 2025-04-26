import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IgnoranceVisualization } from "@/components/ignorance-visualization";

export default function DeadlockIgnorancePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Deadlock Ignorance</h1>

      <div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="mx-auto">
                Deadlock Ignorance (Ostrich Algorithm)
              </CardTitle>
              <CardDescription className="mx-auto">
                Visualize the "pretend it doesn't exist" approach to deadlocks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <IgnoranceVisualization />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Pros and Cons of Deadlock Ignorance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-green-600">
                Advantages
              </h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>No overhead for prevention or detection</li>
                <li>Simple implementation</li>
                <li>Maximum resource utilization</li>
                <li>Good performance when deadlocks are rare</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-red-600">
                Disadvantages
              </h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>No protection against deadlocks</li>
                <li>Difficult to debug when deadlocks occur</li>
                <li>May lead to unpredictable system behavior</li>
                <li>Not suitable for critical systems</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
