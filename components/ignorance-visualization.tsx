"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function IgnoranceVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [step, setStep] = useState(0);
  const [isDeadlocked, setIsDeadlocked] = useState(false);

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

    // Draw the visualization based on step
    drawIgnoranceVisualization(ctx, canvas, step, isDeadlocked);
  }, [step, isDeadlocked]);

  const drawIgnoranceVisualization = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    step: number,
    isDeadlocked: boolean
  ) => {
    // Title
    ctx.font = "18px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.fillText("Deadlock Ignorance Visualization", canvas.width / 2, 30);

    // Draw system components
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Draw computer system
    ctx.beginPath();
    ctx.rect(centerX - 150, centerY - 100, 300, 200);
    ctx.fillStyle = "#f3f4f6";
    ctx.fill();
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw processes
    const processRadius = 25;
    const processes = [
      { id: "P1", x: centerX - 80, y: centerY - 50 },
      { id: "P2", x: centerX + 80, y: centerY - 50 },
      { id: "P3", x: centerX, y: centerY + 50 },
    ];

    // Draw resources
    const resources = [
      { id: "R1", x: centerX - 80, y: centerY + 50 },
      { id: "R2", x: centerX + 80, y: centerY + 50 },
    ];

    // Draw resources
    resources.forEach((resource) => {
      ctx.beginPath();
      ctx.rect(resource.x - 20, resource.y - 20, 40, 40);
      ctx.fillStyle = isDeadlocked ? "#ef4444" : "#10b981";
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
      ctx.fillStyle =
        isDeadlocked && (process.id === "P1" || process.id === "P2")
          ? "#ef4444"
          : "#3b82f6";
      ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(process.id, process.x, process.y);
    });

    // Draw allocation and request arrows based on step
    if (step >= 1) {
      // P1 allocated R1
      ctx.beginPath();
      ctx.moveTo(centerX - 80, centerY + 30);
      ctx.lineTo(centerX - 80, centerY - 25);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add arrowhead
      ctx.beginPath();
      ctx.moveTo(centerX - 80, centerY - 25);
      ctx.lineTo(centerX - 85, centerY - 15);
      ctx.lineTo(centerX - 75, centerY - 15);
      ctx.closePath();
      ctx.fillStyle = "#10b981";
      ctx.fill();
    }

    if (step >= 2) {
      // P2 allocated R2
      ctx.beginPath();
      ctx.moveTo(centerX + 80, centerY + 30);
      ctx.lineTo(centerX + 80, centerY - 25);
      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add arrowhead
      ctx.beginPath();
      ctx.moveTo(centerX + 80, centerY - 25);
      ctx.lineTo(centerX + 75, centerY - 15);
      ctx.lineTo(centerX + 85, centerY - 15);
      ctx.closePath();
      ctx.fillStyle = "#10b981";
      ctx.fill();
    }

    if (step >= 3) {
      // P1 requests R2
      ctx.beginPath();
      ctx.moveTo(centerX - 60, centerY - 50);
      ctx.lineTo(centerX + 60, centerY + 50);
      ctx.strokeStyle = isDeadlocked ? "#ef4444" : "#f59e0b";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add arrowhead
      ctx.beginPath();
      ctx.moveTo(centerX + 60, centerY + 50);
      ctx.lineTo(centerX + 50, centerY + 40);
      ctx.lineTo(centerX + 60, centerY + 40);
      ctx.closePath();
      ctx.fillStyle = isDeadlocked ? "#ef4444" : "#f59e0b";
      ctx.fill();
    }

    if (step >= 4) {
      // P2 requests R1
      ctx.beginPath();
      ctx.moveTo(centerX + 60, centerY - 50);
      ctx.lineTo(centerX - 60, centerY + 50);
      ctx.strokeStyle = isDeadlocked ? "#ef4444" : "#f59e0b";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Add arrowhead
      ctx.beginPath();
      ctx.moveTo(centerX - 60, centerY + 50);
      ctx.lineTo(centerX - 50, centerY + 40);
      ctx.lineTo(centerX - 60, centerY + 40);
      ctx.closePath();
      ctx.fillStyle = isDeadlocked ? "#ef4444" : "#f59e0b";
      ctx.fill();

      // If step 4, we have a deadlock
      if (step === 4) {
        setIsDeadlocked(true);
      }
    }

    // Draw system administrator (only when deadlocked)
    if (isDeadlocked) {
      // Draw admin figure
      const adminX = centerX - 200;
      const adminY = centerY;

      // Draw head
      ctx.beginPath();
      ctx.arc(adminX, adminY - 30, 15, 0, 2 * Math.PI);
      ctx.fillStyle = "#f59e0b";
      ctx.fill();

      // Draw body
      ctx.beginPath();
      ctx.moveTo(adminX, adminY - 15);
      ctx.lineTo(adminX, adminY + 20);
      ctx.strokeStyle = "#f59e0b";
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw arms
      ctx.beginPath();
      ctx.moveTo(adminX - 20, adminY);
      ctx.lineTo(adminX + 20, adminY);
      ctx.stroke();

      // Draw legs
      ctx.beginPath();
      ctx.moveTo(adminX, adminY + 20);
      ctx.lineTo(adminX - 15, adminY + 50);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(adminX, adminY + 20);
      ctx.lineTo(adminX + 15, adminY + 50);
      ctx.stroke();

      // Draw speech bubble
      ctx.beginPath();
      ctx.moveTo(adminX + 30, adminY - 30);
      ctx.lineTo(adminX + 40, adminY - 10);
      ctx.lineTo(adminX + 50, adminY - 30);
      ctx.closePath();
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(adminX + 90, adminY - 50, 60, 30, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      // Draw text in speech bubble
      ctx.font = "12px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("System frozen?", adminX + 90, adminY - 55);
      ctx.fillText("Time to restart!", adminX + 90, adminY - 40);
    }

    // Draw status text at bottom
    ctx.font = "16px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    if (step === 0) {
      ctx.fillText("System running normally", centerX, centerY + 130);
    } else if (step === 1) {
      ctx.fillText("Process P1 acquires Resource R1", centerX, centerY + 130);
    } else if (step === 2) {
      ctx.fillText("Process P2 acquires Resource R2", centerX, centerY + 130);
    } else if (step === 3) {
      ctx.fillText(
        "Process P1 requests Resource R2 (held by P2)",
        centerX,
        centerY + 130
      );
    } else if (step === 4 && !isDeadlocked) {
      ctx.fillText(
        "Process P2 requests Resource R1 (held by P1)",
        centerX,
        centerY + 130
      );
    } else if (isDeadlocked) {
      ctx.fillStyle = "#ef4444";
      ctx.fillText("DEADLOCK! System appears frozen", centerX, centerY + 130);
      ctx.fillText("No detection mechanism in place", centerX, centerY + 150);
    }
  };

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleRestart = () => {
    setStep(0);
    setIsDeadlocked(false);
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
        <Button onClick={handleNextStep} disabled={step >= 4 || isDeadlocked}>
          Next Step
        </Button>
        <Button variant="destructive" onClick={handleRestart}>
          Restart System
        </Button>
      </div>
    </div>
  );
}
