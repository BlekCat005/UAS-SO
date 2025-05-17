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
                    Pemulihan dengan Process Termination
                  </CardTitle>
                  <CardDescription className="mx-auto">
                    Visualisasikan bagaimana penghentian proses dapat
                    menyelesaikan deadlock
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
                    Pemulihan dengan Resource Preemption
                  </CardTitle>
                  <CardDescription className="mx-auto">
                    Visualisasikan bagaimana pengambilalihan resource dapat
                    menyelesaikan deadlock
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
          <CardTitle>Tentang Deadlock Recovery</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Deadlock recovery adalah strategi di mana sistem membiarkan deadlock
            terjadi, tetapi memiliki mekanisme untuk memulihkannya saat
            terdeteksi. Metode pemulihan meliputi process termination dan
            resource preemption, masing-masing dengan kelebihan dan
            kekurangannya dalam hal beban sistem dan dampaknya.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
