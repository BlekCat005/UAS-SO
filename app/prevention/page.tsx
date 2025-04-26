"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PreventionVisualization } from "@/components/prevention-visualization";

export default function DeadlockPreventionPage() {
  const [isResourceSharing, setIsResourceSharing] = useState(false);
  const [isAllOrNothing, setIsAllOrNothing] = useState(false);
  const [isPreemption, setIsPreemption] = useState(false);
  const [isResourceOrdering, setIsResourceOrdering] = useState(false);

  const toggleResourceSharing = () => {
    setIsResourceSharing(!isResourceSharing);
  };

  const toggleAllOrNothing = () => {
    setIsAllOrNothing(!isAllOrNothing);
  };

  const togglePreemption = () => {
    setIsPreemption(!isPreemption);
  };

  const toggleResourceOrdering = () => {
    setIsResourceOrdering(!isResourceOrdering);
  };

  const resetSimulation = () => {
    setIsResourceSharing(false);
    setIsAllOrNothing(false);
    setIsPreemption(false);
    setIsResourceOrdering(false);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Deadlock Prevention</h1>

      <Tabs defaultValue="mutual-exclusion">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mutual-exclusion">Mutual Exclusion</TabsTrigger>
          <TabsTrigger value="hold-wait">Hold and Wait</TabsTrigger>
          <TabsTrigger value="no-preemption">No Preemption</TabsTrigger>
          <TabsTrigger value="circular-wait">Circular Wait</TabsTrigger>
        </TabsList>

        <TabsContent value="mutual-exclusion" className="mt-6">
          <div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="mx-auto">
                    Mutual Exclusion Prevention
                  </CardTitle>
                  <CardDescription className="mx-auto">
                    Visualize how eliminating mutual exclusion prevents
                    deadlocks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PreventionVisualization type="mutual-exclusion" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="hold-wait" className="mt-6">
          <div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="mx-auto">
                    Hold and Wait Prevention
                  </CardTitle>
                  <CardDescription className="mx-auto">
                    Visualize how preventing hold and wait condition prevents
                    deadlocks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PreventionVisualization type="hold-wait" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="no-preemption" className="mt-6">
          <div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="mx-auto">
                    No Preemption Prevention
                  </CardTitle>
                  <CardDescription className="mx-auto">
                    Visualize how allowing preemption prevents deadlocks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PreventionVisualization type="no-preemption" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="circular-wait" className="mt-6">
          <div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="mx-auto">
                    Circular Wait Prevention
                  </CardTitle>
                  <CardDescription className="mx-auto">
                    Visualize how preventing circular wait prevents deadlocks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PreventionVisualization type="circular-wait" />
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
