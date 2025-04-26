"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface RecoveryVisualizationProps {
  type: "process-termination" | "resource-preemption";
}

export function RecoveryVisualization({ type }: RecoveryVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);
  const [terminatedProcess, setTerminatedProcess] = useState<string | null>(
    null
  );
  const [preemptedResource, setPreemptedResource] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = "#f9fafb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw based on recovery type and step
    if (type === "process-termination") {
      drawProcessTermination(ctx, canvas, step, terminatedProcess);
    } else {
      drawResourcePreemption(ctx, canvas, step, preemptedResource);
    }
  }, [type, step, terminatedProcess, preemptedResource]);

  const drawProcessTermination = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    step: number,
    terminatedProcess: string | null
  ) => {
    // Title
    ctx.font = "18px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Process Termination Recovery", canvas.width / 2, 30);

    // Draw processes and resources
    const processRadius = 25;
    const centerX = canvas.width / 2;
    const centerY = 170;

    // Draw deadlock situation
    if (step === 0) {
      // Draw processes in a circle
      const processes = [
        { id: "P1", x: centerX - 100, y: centerY - 50, terminated: false },
        { id: "P2", x: centerX + 100, y: centerY - 50, terminated: false },
        { id: "P3", x: centerX, y: centerY + 70, terminated: false },
      ];

      const resources = [
        { id: "R1", x: centerX - 50, y: centerY + 20 },
        { id: "R2", x: centerX + 50, y: centerY + 20 },
        { id: "R3", x: centerX, y: centerY - 80 },
      ];

      // Draw resources
      resources.forEach((resource) => {
        ctx.beginPath();
        ctx.rect(resource.x - 20, resource.y - 20, 40, 40);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(resource.id, resource.x, resource.y);
      });

      // Draw processes
      processes.forEach((process) => {
        ctx.beginPath();
        ctx.arc(process.x, process.y, processRadius, 0, 2 * Math.PI);
        ctx.fillStyle = process.terminated ? "#6b7280" : "#3b82f6";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(process.id, process.x, process.y);
      });

      // Draw allocation and request arrows
      // P1 holds R1, requests R2
      ctx.beginPath();
      ctx.moveTo(centerX - 50, centerY + 20);
      ctx.lineTo(centerX - 100, centerY - 50 + processRadius);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - 100, centerY - 50);
      ctx.lineTo(centerX + 30, centerY + 20);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // P2 holds R2, requests R3
      ctx.beginPath();
      ctx.moveTo(centerX + 50, centerY + 20);
      ctx.lineTo(centerX + 100, centerY - 50 + processRadius);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 100, centerY - 50);
      ctx.lineTo(centerX, centerY - 80);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // P3 holds R3, requests R1
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 80);
      ctx.lineTo(centerX, centerY + 70 - processRadius);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX, centerY + 70);
      ctx.lineTo(centerX - 50, centerY + 20);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add text explaining the deadlock
      ctx.font = "16px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText("Deadlock Detected", centerX, 320);
      ctx.font = "14px Arial";
      ctx.fillStyle = "#ef4444";
      ctx.fillText("P1→R2→P2→R3→P3→R1→P1", centerX, 350);
    }
    // Draw after terminating a process
    else if (step === 1) {
      // Draw processes in a circle
      const processes = [
        {
          id: "P1",
          x: centerX - 100,
          y: centerY - 50,
          terminated: terminatedProcess === "P1",
        },
        {
          id: "P2",
          x: centerX + 100,
          y: centerY - 50,
          terminated: terminatedProcess === "P2",
        },
        {
          id: "P3",
          x: centerX,
          y: centerY + 70,
          terminated: terminatedProcess === "P3" || terminatedProcess === "all",
        },
      ];

      const resources = [
        { id: "R1", x: centerX - 50, y: centerY + 20 },
        { id: "R2", x: centerX + 50, y: centerY + 20 },
        { id: "R3", x: centerX, y: centerY - 80 },
      ];

      // Draw resources
      resources.forEach((resource) => {
        ctx.beginPath();
        ctx.rect(resource.x - 20, resource.y - 20, 40, 40);
        ctx.fillStyle = "#10b981";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(resource.id, resource.x, resource.y);
      });

      // Draw processes
      processes.forEach((process) => {
        ctx.beginPath();
        ctx.arc(process.x, process.y, processRadius, 0, 2 * Math.PI);
        ctx.fillStyle = process.terminated ? "#6b7280" : "#3b82f6";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(process.id, process.x, process.y);
      });

      // Draw allocation arrows for remaining processes based on which process was terminated
      if (terminatedProcess === "P1" || terminatedProcess === "all") {
        // P1 terminated, so P3 can get R1 and P2 can continue
        if (!processes[2].terminated) {
          // P3 gets R1
          ctx.beginPath();
          ctx.moveTo(centerX - 50, centerY + 20);
          ctx.lineTo(centerX, centerY + 70 - processRadius);
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        if (!processes[1].terminated) {
          // P2 still holds R2
          ctx.beginPath();
          ctx.moveTo(centerX + 50, centerY + 20);
          ctx.lineTo(centerX + 100, centerY - 50 + processRadius);
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.stroke();

          // P2 gets R3
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - 80);
          ctx.lineTo(centerX + 100, centerY - 50);
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (terminatedProcess === "P2") {
        // P2 terminated, so P1 can get R2 and P3 can continue
        if (!processes[0].terminated) {
          // P1 holds R1
          ctx.beginPath();
          ctx.moveTo(centerX - 50, centerY + 20);
          ctx.lineTo(centerX - 100, centerY - 50 + processRadius);
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.stroke();

          // P1 gets R2
          ctx.beginPath();
          ctx.moveTo(centerX + 50, centerY + 20);
          ctx.lineTo(centerX - 100, centerY - 50);
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        if (!processes[2].terminated) {
          // P3 holds R3
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - 80);
          ctx.lineTo(centerX, centerY + 70 - processRadius);
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      } else if (terminatedProcess === "P3") {
        // P3 terminated, so P2 can get R3 and P1 can continue
        if (!processes[0].terminated) {
          // P1 holds R1
          ctx.beginPath();
          ctx.moveTo(centerX - 50, centerY + 20);
          ctx.lineTo(centerX - 100, centerY - 50 + processRadius);
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        if (!processes[1].terminated) {
          // P2 holds R2
          ctx.beginPath();
          ctx.moveTo(centerX + 50, centerY + 20);
          ctx.lineTo(centerX + 100, centerY - 50 + processRadius);
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.stroke();

          // P2 gets R3
          ctx.beginPath();
          ctx.moveTo(centerX, centerY - 80);
          ctx.lineTo(centerX + 100, centerY - 50);
          ctx.strokeStyle = "#10b981";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Add text explaining the recovery
      ctx.font = "16px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";

      if (terminatedProcess === "all") {
        ctx.fillText("All Processes Terminated", centerX, 320);
      } else {
        ctx.fillText(`Process ${terminatedProcess} Terminated`, centerX, 320);
      }

      ctx.font = "14px Arial";
      ctx.fillStyle = "#10b981";
      ctx.fillText(
        "Deadlock resolved, remaining processes can continue",
        centerX,
        350
      );
    }
  };

  const drawResourcePreemption = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    step: number,
    preemptedResource: string | null
  ) => {
    // Title
    ctx.font = "18px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Resource Preemption Recovery", canvas.width / 2, 30);

    // Draw processes and resources
    const processRadius = 25;
    const centerX = canvas.width / 2;
    const centerY = 170;

    // Draw deadlock situation
    if (step === 0) {
      // Draw processes
      const processes = [
        { id: "P1", x: centerX - 100, y: centerY - 50 },
        { id: "P2", x: centerX + 100, y: centerY - 50 },
      ];

      const resources = [
        { id: "R1", x: centerX - 50, y: centerY + 50 },
        { id: "R2", x: centerX + 50, y: centerY + 50 },
      ];

      // Draw resources
      resources.forEach((resource) => {
        ctx.beginPath();
        ctx.rect(resource.x - 20, resource.y - 20, 40, 40);
        ctx.fillStyle = "#ef4444";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(resource.id, resource.x, resource.y);
      });

      // Draw processes
      processes.forEach((process) => {
        ctx.beginPath();
        ctx.arc(process.x, process.y, processRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(process.id, process.x, process.y);
      });

      // Draw allocation and request arrows
      // P1 holds R1, requests R2
      ctx.beginPath();
      ctx.moveTo(centerX - 50, centerY + 50);
      ctx.lineTo(centerX - 100, centerY - 50 + processRadius);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX - 100, centerY - 50);
      ctx.lineTo(centerX + 50, centerY + 50);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // P2 holds R2, requests R1
      ctx.beginPath();
      ctx.moveTo(centerX + 50, centerY + 50);
      ctx.lineTo(centerX + 100, centerY - 50 + processRadius);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + 100, centerY - 50);
      ctx.lineTo(centerX - 50, centerY + 50);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add text explaining the deadlock
      ctx.font = "16px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText("Deadlock Detected", centerX, 320);
      ctx.font = "14px Arial";
      ctx.fillStyle = "#ef4444";
      ctx.fillText("P1→R2→P2→R1→P1", centerX, 350);
    }
    // Draw after preempting a resource
    else if (step === 1) {
      // Draw processes
      const processes = [
        { id: "P1", x: centerX - 100, y: centerY - 50 },
        { id: "P2", x: centerX + 100, y: centerY - 50 },
      ];

      const resources = [
        { id: "R1", x: centerX - 50, y: centerY + 50 },
        { id: "R2", x: centerX + 50, y: centerY + 50 },
      ];

      // Draw resources
      resources.forEach((resource) => {
        ctx.beginPath();
        ctx.rect(resource.x - 20, resource.y - 20, 40, 40);
        ctx.fillStyle = "#10b981";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(resource.id, resource.x, resource.y);
      });

      // Draw processes
      processes.forEach((process) => {
        ctx.beginPath();
        ctx.arc(process.x, process.y, processRadius, 0, 2 * Math.PI);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(process.id, process.x, process.y);
      });

      // Draw allocation arrows after preemption
      if (preemptedResource === "R1") {
        // R1 preempted from P1, P2 can now get R1
        // P2 holds R2
        ctx.beginPath();
        ctx.moveTo(centerX + 50, centerY + 50);
        ctx.lineTo(centerX + 100, centerY - 50 + processRadius);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.stroke();

        // P2 gets R1
        ctx.beginPath();
        ctx.moveTo(centerX - 50, centerY + 50);
        ctx.lineTo(centerX + 100, centerY - 50);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.stroke();

        // P1 waiting for resources
        ctx.beginPath();
        ctx.moveTo(centerX - 100, centerY - 50);
        ctx.lineTo(centerX + 50, centerY + 50);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (preemptedResource === "R2") {
        // R2 preempted from P2, P1 can now get R2
        // P1 holds R1
        ctx.beginPath();
        ctx.moveTo(centerX - 50, centerY + 50);
        ctx.lineTo(centerX - 100, centerY - 50 + processRadius);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.stroke();

        // P1 gets R2
        ctx.beginPath();
        ctx.moveTo(centerX + 50, centerY + 50);
        ctx.lineTo(centerX - 100, centerY - 50);
        ctx.strokeStyle = "#10b981";
        ctx.lineWidth = 2;
        ctx.stroke();

        // P2 waiting for resources
        ctx.beginPath();
        ctx.moveTo(centerX + 100, centerY - 50);
        ctx.lineTo(centerX - 50, centerY + 50);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Add text explaining the recovery
      ctx.font = "16px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText(`Resource ${preemptedResource} Preempted`, centerX, 320);
      ctx.font = "14px Arial";
      ctx.fillStyle = "#10b981";

      if (preemptedResource === "R1") {
        ctx.fillText("P2 can now complete, P1 will retry later", centerX, 350);
      } else {
        ctx.fillText("P1 can now complete, P2 will retry later", centerX, 350);
      }
    }
  };

  // Handle process termination
  const terminateProcess = (processId: string) => {
    setTerminatedProcess(processId);
    setStep(1);
  };

  // Handle resource preemption
  const preemptResource = (resourceId: string) => {
    setPreemptedResource(resourceId);
    setStep(1);
  };

  // Reset simulation
  const resetSimulation = () => {
    setStep(0);
    setTerminatedProcess(null);
    setPreemptedResource(null);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[600px] h-[400px] mx-auto"
          style={{ touchAction: "none" }}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {type === "process-termination" ? (
          <>
            <Button
              variant={step === 0 ? "default" : "outline"}
              onClick={() => setStep(0)}
              disabled={step === 0}
            >
              Step 1: Deadlock
            </Button>
            <Button
              variant={
                step === 1 && terminatedProcess === "P1" ? "default" : "outline"
              }
              onClick={() => terminateProcess("P1")}
              disabled={step === 1 && terminatedProcess === "P1"}
            >
              Terminate P1
            </Button>
            <Button
              variant={
                step === 1 && terminatedProcess === "P2" ? "default" : "outline"
              }
              onClick={() => terminateProcess("P2")}
              disabled={step === 1 && terminatedProcess === "P2"}
            >
              Terminate P2
            </Button>
            <Button
              variant={
                step === 1 && terminatedProcess === "P3" ? "default" : "outline"
              }
              onClick={() => terminateProcess("P3")}
              disabled={step === 1 && terminatedProcess === "P3"}
            >
              Terminate P3
            </Button>
            <Button
              variant={
                step === 1 && terminatedProcess === "all"
                  ? "default"
                  : "outline"
              }
              onClick={() => terminateProcess("all")}
              disabled={step === 1 && terminatedProcess === "all"}
            >
              Terminate All
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={step === 0 ? "default" : "outline"}
              onClick={() => setStep(0)}
              disabled={step === 0}
            >
              Step 1: Deadlock
            </Button>
            <Button
              variant={
                step === 1 && preemptedResource === "R1" ? "default" : "outline"
              }
              onClick={() => preemptResource("R1")}
              disabled={step === 1 && preemptedResource === "R1"}
            >
              Preempt R1
            </Button>
            <Button
              variant={
                step === 1 && preemptedResource === "R2" ? "default" : "outline"
              }
              onClick={() => preemptResource("R2")}
              disabled={step === 1 && preemptedResource === "R2"}
            >
              Preempt R2
            </Button>
          </>
        )}
        <Button variant="outline" onClick={resetSimulation}>
          Reset Simulation
        </Button>
      </div>
    </div>
  );
}
