"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface PreventionVisualizationProps {
  type: "mutual-exclusion" | "hold-wait" | "no-preemption" | "circular-wait";
}

export function PreventionVisualization({
  type,
}: PreventionVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPreventionEnabled, setIsPreventionEnabled] = useState(false);

  // Reset simulation
  const resetSimulation = () => {
    setIsPreventionEnabled(false);
  };

  // Toggle prevention strategy
  const togglePrevention = () => {
    setIsPreventionEnabled(!isPreventionEnabled);
  };

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

    // Draw based on prevention type
    switch (type) {
      case "mutual-exclusion":
        drawMutualExclusionPrevention(ctx, canvas, isPreventionEnabled);
        break;
      case "hold-wait":
        drawHoldWaitPrevention(ctx, canvas, isPreventionEnabled);
        break;
      case "no-preemption":
        drawNoPreemptionPrevention(ctx, canvas, isPreventionEnabled);
        break;
      case "circular-wait":
        drawCircularWaitPrevention(ctx, canvas, isPreventionEnabled);
        break;
    }
  }, [type, isPreventionEnabled]);

  // Draw functions for each prevention type
  const drawMutualExclusionPrevention = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    preventionEnabled: boolean
  ) => {
    // Title
    ctx.font = "18px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Mutual Exclusion Prevention", canvas.width / 2, 30);

    // Draw two scenarios side by side

    // Left side: With mutual exclusion (deadlock possible)
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("With Mutual Exclusion", canvas.width / 4, 60);

    // Draw processes
    const processRadius = 25;

    // Process 1
    ctx.beginPath();
    ctx.arc(canvas.width / 4 - 60, 120, processRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("P1", canvas.width / 4 - 60, 120);

    // Process 2
    ctx.beginPath();
    ctx.arc(canvas.width / 4 + 60, 120, processRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("P2", canvas.width / 4 + 60, 120);

    // Resource
    ctx.beginPath();
    ctx.rect(canvas.width / 4 - 25, 200, 50, 50);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("R", canvas.width / 4, 225);

    // Draw arrows
    ctx.beginPath();
    ctx.moveTo(canvas.width / 4 - 60, 120 + processRadius);
    ctx.lineTo(canvas.width / 4 - 10, 200);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 4 + 60, 120 + processRadius);
    ctx.lineTo(canvas.width / 4 + 10, 200);
    ctx.stroke();

    // Add text explaining the issue
    ctx.font = "14px Arial";
    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "center";
    ctx.fillText("Both processes want exclusive", canvas.width / 4, 280);
    ctx.fillText("access to resource R", canvas.width / 4, 300);
    ctx.fillText("→ Potential Deadlock", canvas.width / 4, 320);

    // Right side: Without mutual exclusion (no deadlock)
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Without Mutual Exclusion", (3 * canvas.width) / 4, 60);

    // Process 1
    ctx.beginPath();
    ctx.arc((3 * canvas.width) / 4 - 60, 120, processRadius, 0, 2 * Math.PI);
    ctx.fillStyle = preventionEnabled ? "#3b82f6" : "#d1d5db";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("P1", (3 * canvas.width) / 4 - 60, 120);

    // Process 2
    ctx.beginPath();
    ctx.arc((3 * canvas.width) / 4 + 60, 120, processRadius, 0, 2 * Math.PI);
    ctx.fillStyle = preventionEnabled ? "#3b82f6" : "#d1d5db";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("P2", (3 * canvas.width) / 4 + 60, 120);

    // Shared Resource
    ctx.beginPath();
    ctx.rect((3 * canvas.width) / 4 - 25, 200, 50, 50);
    ctx.fillStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("R", (3 * canvas.width) / 4, 225);

    // Draw arrows (bidirectional)
    ctx.beginPath();
    ctx.moveTo((3 * canvas.width) / 4 - 60, 120 + processRadius);
    ctx.lineTo((3 * canvas.width) / 4 - 10, 200);
    ctx.strokeStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((3 * canvas.width) / 4 + 60, 120 + processRadius);
    ctx.lineTo((3 * canvas.width) / 4 + 10, 200);
    ctx.stroke();

    // Add text explaining the solution
    ctx.font = "14px Arial";
    ctx.fillStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.textAlign = "center";
    ctx.fillText("Resource R is sharable", (3 * canvas.width) / 4, 280);
    ctx.fillText("Both processes can access it", (3 * canvas.width) / 4, 300);
    ctx.fillText("→ No Deadlock Possible", (3 * canvas.width) / 4, 320);
  };

  const drawHoldWaitPrevention = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    preventionEnabled: boolean
  ) => {
    // Title
    ctx.font = "18px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Hold and Wait Prevention", canvas.width / 2, 30);

    // Left side: With hold and wait (deadlock possible)
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("With Hold and Wait", canvas.width / 4, 60);

    // Draw processes and resources
    const processRadius = 25;

    // Process 1 holding R1, waiting for R2
    ctx.beginPath();
    ctx.arc(canvas.width / 4 - 60, 120, processRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("P1", canvas.width / 4 - 60, 120);

    // Process 2 holding R2, waiting for R1
    ctx.beginPath();
    ctx.arc(canvas.width / 4 + 60, 120, processRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("P2", canvas.width / 4 + 60, 120);

    // Resource 1
    ctx.beginPath();
    ctx.rect(canvas.width / 4 - 80, 200, 40, 40);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("R1", canvas.width / 4 - 60, 220);

    // Resource 2
    ctx.beginPath();
    ctx.rect(canvas.width / 4 + 40, 200, 40, 40);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("R2", canvas.width / 4 + 60, 220);

    // Draw allocation arrows
    ctx.beginPath();
    ctx.moveTo(canvas.width / 4 - 60, 200);
    ctx.lineTo(canvas.width / 4 - 60, 120 + processRadius);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 4 + 60, 200);
    ctx.lineTo(canvas.width / 4 + 60, 120 + processRadius);
    ctx.stroke();

    // Draw request arrows
    ctx.beginPath();
    ctx.moveTo(canvas.width / 4 - 60 + 15, 120);
    ctx.lineTo(canvas.width / 4 + 60 - 15, 120);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add arrowhead
    ctx.beginPath();
    ctx.moveTo(canvas.width / 4 + 45, 120);
    ctx.lineTo(canvas.width / 4 + 35, 115);
    ctx.lineTo(canvas.width / 4 + 35, 125);
    ctx.closePath();
    ctx.fillStyle = "#ef4444";
    ctx.fill();

    // Add text explaining the issue
    ctx.font = "14px Arial";
    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "center";
    ctx.fillText("P1 holds R1, waits for R2", canvas.width / 4, 260);
    ctx.fillText("P2 holds R2, waits for R1", canvas.width / 4, 280);
    ctx.fillText("→ Deadlock", canvas.width / 4, 300);

    // Right side: Without hold and wait (no deadlock)
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Without Hold and Wait", (3 * canvas.width) / 4, 60);

    // Process 1 requesting all resources at once
    ctx.beginPath();
    ctx.arc((3 * canvas.width) / 4, 120, processRadius, 0, 2 * Math.PI);
    ctx.fillStyle = preventionEnabled ? "#3b82f6" : "#d1d5db";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("P1", (3 * canvas.width) / 4, 120);

    // Resource 1
    ctx.beginPath();
    ctx.rect((3 * canvas.width) / 4 - 80, 200, 40, 40);
    ctx.fillStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("R1", (3 * canvas.width) / 4 - 60, 220);

    // Resource 2
    ctx.beginPath();
    ctx.rect((3 * canvas.width) / 4 + 40, 200, 40, 40);
    ctx.fillStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("R2", (3 * canvas.width) / 4 + 60, 220);

    // Draw allocation arrows for both resources
    ctx.beginPath();
    ctx.moveTo((3 * canvas.width) / 4 - 60, 200);
    ctx.lineTo((3 * canvas.width) / 4 - 20, 120 + processRadius);
    ctx.strokeStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo((3 * canvas.width) / 4 + 60, 200);
    ctx.lineTo((3 * canvas.width) / 4 + 20, 120 + processRadius);
    ctx.stroke();

    // Add text explaining the solution
    ctx.font = "14px Arial";
    ctx.fillStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.textAlign = "center";
    ctx.fillText("P1 acquires all needed", (3 * canvas.width) / 4, 260);
    ctx.fillText("resources at once", (3 * canvas.width) / 4, 280);
    ctx.fillText("→ No Deadlock Possible", (3 * canvas.width) / 4, 300);
  };

  const drawNoPreemptionPrevention = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    preventionEnabled: boolean
  ) => {
    // Title
    ctx.font = "18px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("No Preemption Prevention", canvas.width / 2, 30);

    // Left side: With no preemption (deadlock possible)
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Without Preemption", canvas.width / 4, 60);

    // Draw processes and resources
    const processRadius = 25;

    // Process 1
    ctx.beginPath();
    ctx.arc(canvas.width / 4 - 60, 120, processRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("P1", canvas.width / 4 - 60, 120);

    // Process 2
    ctx.beginPath();
    ctx.arc(canvas.width / 4 + 60, 120, processRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("P2", canvas.width / 4 + 60, 120);

    // Resources
    ctx.beginPath();
    ctx.rect(canvas.width / 4 - 80, 200, 40, 40);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("R1", canvas.width / 4 - 60, 220);

    ctx.beginPath();
    ctx.rect(canvas.width / 4 + 40, 200, 40, 40);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("R2", canvas.width / 4 + 60, 220);

    // Draw allocation and request arrows
    // P1 holds R1, requests R2
    ctx.beginPath();
    ctx.moveTo(canvas.width / 4 - 60, 200);
    ctx.lineTo(canvas.width / 4 - 60, 120 + processRadius);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 4 - 40, 130);
    ctx.lineTo(canvas.width / 4 + 40, 200);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    // P2 holds R2, requests R1
    ctx.beginPath();
    ctx.moveTo(canvas.width / 4 + 60, 200);
    ctx.lineTo(canvas.width / 4 + 60, 120 + processRadius);
    ctx.strokeStyle = "#10b981";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(canvas.width / 4 + 40, 130);
    ctx.lineTo(canvas.width / 4 - 40, 200);
    ctx.strokeStyle = "#ef4444";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Add text explaining the issue
    ctx.font = "14px Arial";
    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "center";
    ctx.fillText("Resources cannot be taken away", canvas.width / 4, 260);
    ctx.fillText("from processes until released", canvas.width / 4, 280);
    ctx.fillText("→ Deadlock", canvas.width / 4, 300);

    // Right side: With preemption (no deadlock)
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("With Preemption", (3 * canvas.width) / 4, 60);

    // Process 1
    ctx.beginPath();
    ctx.arc((3 * canvas.width) / 4 - 60, 120, processRadius, 0, 2 * Math.PI);
    ctx.fillStyle = preventionEnabled ? "#3b82f6" : "#d1d5db";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("P1", (3 * canvas.width) / 4 - 60, 120);

    // Process 2
    ctx.beginPath();
    ctx.arc((3 * canvas.width) / 4 + 60, 120, processRadius, 0, 2 * Math.PI);
    ctx.fillStyle = preventionEnabled ? "#3b82f6" : "#d1d5db";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("P2", (3 * canvas.width) / 4 + 60, 120);

    // Resources
    ctx.beginPath();
    ctx.rect((3 * canvas.width) / 4 - 80, 200, 40, 40);
    ctx.fillStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("R1", (3 * canvas.width) / 4 - 60, 220);

    ctx.beginPath();
    ctx.rect((3 * canvas.width) / 4 + 40, 200, 40, 40);
    ctx.fillStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.fillText("R2", (3 * canvas.width) / 4 + 60, 220);

    // Draw preemption arrow
    ctx.beginPath();
    ctx.moveTo((3 * canvas.width) / 4 - 60, 200);
    ctx.lineTo((3 * canvas.width) / 4 - 60, 120 + processRadius);
    ctx.strokeStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw dashed line to show preemption
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ctx.moveTo((3 * canvas.width) / 4 - 60, 200);
    ctx.lineTo((3 * canvas.width) / 4 + 60, 120 + processRadius);
    ctx.strokeStyle = preventionEnabled ? "#f59e0b" : "#d1d5db";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // Add text explaining the solution
    ctx.font = "14px Arial";
    ctx.fillStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.textAlign = "center";
    ctx.fillText("Resources can be preempted", (3 * canvas.width) / 4, 260);
    ctx.fillText("if needed by other processes", (3 * canvas.width) / 4, 280);
    ctx.fillText("→ No Deadlock Possible", (3 * canvas.width) / 4, 300);
  };

  const drawCircularWaitPrevention = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    preventionEnabled: boolean
  ) => {
    // Title
    ctx.font = "18px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Circular Wait Prevention", canvas.width / 2, 30);

    // Left side: With circular wait (deadlock possible)
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("With Circular Wait", canvas.width / 4, 60);

    // Draw processes in a circle
    const processRadius = 25;
    const centerX = canvas.width / 4;
    const centerY = 170;
    const orbitRadius = 80;

    // Draw three processes in a circle
    for (let i = 0; i < 3; i++) {
      const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
      const x = centerX + orbitRadius * Math.cos(angle);
      const y = centerY + orbitRadius * Math.sin(angle);

      ctx.beginPath();
      ctx.arc(x, y, processRadius, 0, 2 * Math.PI);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`P${i + 1}`, x, y);

      // Draw resources between processes
      const nextI = (i + 1) % 3;
      const nextAngle = (nextI * 2 * Math.PI) / 3 - Math.PI / 2;
      const nextX = centerX + orbitRadius * Math.cos(nextAngle);
      const nextY = centerY + orbitRadius * Math.sin(nextAngle);

      const resourceX = (x + nextX) / 2;
      const resourceY = (y + nextY) / 2;

      ctx.beginPath();
      ctx.rect(resourceX - 15, resourceY - 15, 30, 30);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`R${i + 1}`, resourceX, resourceY);

      // Draw allocation arrow (Pi holds Ri)
      ctx.beginPath();
      ctx.moveTo(resourceX, resourceY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw request arrow (Pi wants Ri+1)
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(resourceX, resourceY);
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Add text explaining the issue
    ctx.font = "14px Arial";
    ctx.fillStyle = "#ef4444";
    ctx.textAlign = "center";
    ctx.fillText("Circular chain of resource requests", canvas.width / 4, 280);
    ctx.fillText("P1→R2→P2→R3→P3→R1→P1", canvas.width / 4, 300);
    ctx.fillText("→ Deadlock", canvas.width / 4, 320);

    // Right side: Without circular wait (no deadlock)
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Without Circular Wait", (3 * canvas.width) / 4, 60);

    // Draw processes in a line
    const rightCenterX = (3 * canvas.width) / 4;

    for (let i = 0; i < 3; i++) {
      const x = rightCenterX;
      const y = 100 + i * 70;

      ctx.beginPath();
      ctx.arc(x, y, processRadius, 0, 2 * Math.PI);
      ctx.fillStyle = preventionEnabled ? "#3b82f6" : "#d1d5db";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`P${i + 1}`, x, y);

      // Draw resources
      const resourceX = rightCenterX - 80;
      const resourceY = y;

      ctx.beginPath();
      ctx.rect(resourceX - 15, resourceY - 15, 30, 30);
      ctx.fillStyle = preventionEnabled ? "#10b981" : "#d1d5db";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.fillText(`R${i + 1}`, resourceX, resourceY);

      // Draw allocation arrow
      ctx.beginPath();
      ctx.moveTo(resourceX + 15, resourceY);
      ctx.lineTo(x - processRadius, y);
      ctx.strokeStyle = preventionEnabled ? "#10b981" : "#d1d5db";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Add text explaining the solution
    ctx.font = "14px Arial";
    ctx.fillStyle = preventionEnabled ? "#10b981" : "#d1d5db";
    ctx.textAlign = "center";
    ctx.fillText("Resources are numbered and", rightCenterX, 280);
    ctx.fillText("processes request in order", rightCenterX, 300);
    ctx.fillText("→ No Deadlock Possible", rightCenterX, 320);
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

      <div className="flex justify-center gap-4">
        <Button
          onClick={togglePrevention}
          variant={isPreventionEnabled ? "default" : "outline"}
        >
          {isPreventionEnabled ? "Disable" : "Enable"}{" "}
          {type === "mutual-exclusion"
            ? "Resource Sharing"
            : type === "hold-wait"
            ? "All-or-Nothing Allocation"
            : type === "no-preemption"
            ? "Preemption"
            : "Resource Ordering"}
        </Button>
        <Button variant="outline" onClick={resetSimulation}>
          Reset Simulation
        </Button>
      </div>
    </div>
  );
}
