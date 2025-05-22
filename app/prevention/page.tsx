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
      <h1 className="text-3xl font-bold mb-6">Pencegahan Deadlock</h1>{" "}
      {/* Translation */}
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
                    Pencegahan Mutual Exclusion
                  </CardTitle>{" "}
                  {/* Translation */}
                  <CardDescription className="mx-auto">
                    Visualisasikan bagaimana menghilangkan mutual exclusion
                    mencegah deadlock
                  </CardDescription>{" "}
                  {/* Translation */}
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
                    Pencegahan Hold and Wait
                  </CardTitle>{" "}
                  {/* Translation */}
                  <CardDescription className="mx-auto">
                    Visualisasikan bagaimana mencegah kondisi hold and wait
                    mencegah deadlock
                  </CardDescription>{" "}
                  {/* Translation */}
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
                    Pencegahan No Preemption
                  </CardTitle>{" "}
                  {/* Translation */}
                  <CardDescription className="mx-auto">
                    Visualisasikan bagaimana mengizinkan preemption mencegah
                    deadlock
                  </CardDescription>{" "}
                  {/* Translation */}
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
                    Pencegahan Circular Wait
                  </CardTitle>{" "}
                  {/* Translation */}
                  <CardDescription className="mx-auto">
                    Visualisasikan bagaimana mencegah circular wait mencegah
                    deadlock
                  </CardDescription>{" "}
                  {/* Translation */}
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
