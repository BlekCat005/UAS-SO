"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function BankersAlgorithm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSafe, setIsSafe] = useState<boolean | null>(null);
  const [safeSequence, setSafeSequence] = useState<string[]>([]);

  // Data simulasi
  const [allocation, setAllocation] = useState([
    [0, 1, 0], // P0
    [2, 0, 0], // P1
    [3, 0, 2], // P2
    [2, 1, 1], // P3
    [0, 0, 2], // P4
  ]);

  const [max, setMax] = useState([
    [7, 5, 3], // P0
    [3, 2, 2], // P1
    [9, 0, 2], // P2
    [2, 2, 2], // P3
    [4, 3, 3], // P4
  ]);

  const [available, setAvailable] = useState([3, 3, 2]);

  // Fungsi untuk menjalankan algoritma Banker
  const runBankersAlgorithm = () => {
    // Hitung need matrix
    const need = allocation.map((row, i) =>
      row.map((val, j) => max[i][j] - val)
    );

    // Inisialisasi work dan finish
    const work = [...available];
    const finish = Array(allocation.length).fill(false);
    const sequence: string[] = [];

    // Cari sequence aman
    let progress = true;
    while (progress) {
      progress = false;

      for (let i = 0; i < allocation.length; i++) {
        if (!finish[i]) {
          // Periksa apakah semua kebutuhan dapat dipenuhi
          let canAllocate = true;
          for (let j = 0; j < work.length; j++) {
            if (need[i][j] > work[j]) {
              canAllocate = false;
              break;
            }
          }

          if (canAllocate) {
            // Proses dapat selesai, tambahkan ke sequence
            progress = true;
            finish[i] = true;
            sequence.push(`P${i}`);

            // Kembalikan sumber daya
            for (let j = 0; j < work.length; j++) {
              work[j] += allocation[i][j];
            }
          }
        }
      }
    }

    // Periksa apakah semua proses selesai
    const safe = finish.every((f) => f);

    setIsSafe(safe);
    setSafeSequence(sequence);
  };

  // Reset simulasi
  const resetSimulation = () => {
    setIsSafe(null);
    setSafeSequence([]);
  };

  // Update available resources
  const updateAvailable = (index: number, value: number) => {
    const newAvailable = [...available];
    newAvailable[index] = value;
    setAvailable(newAvailable);
    // Reset safety status when resources change
    setIsSafe(null);
    setSafeSequence([]);
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

    // Define processes and resources
    const processes = ["P0", "P1", "P2", "P3", "P4"];
    const resources = ["A", "B", "C"];

    // Calculate need matrix
    const need = allocation.map((row, i) =>
      row.map((val, j) => max[i][j] - val)
    );

    // Draw the visualization
    const drawBankersAlgorithm = () => {
      if (!ctx) return;

      // Title
      ctx.font = "18px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText("Visualisasi Algoritma Banker", canvas.width / 2, 30);

      // Draw process states
      const processRadius = 30;
      const startX = 100;
      const startY = 120;
      const spacing = 80;

      // Draw processes
      processes.forEach((process, index) => {
        const x = startX + index * spacing;
        const y = startY;

        // Process circle
        ctx.beginPath();
        ctx.arc(x, y, processRadius, 0, 2 * Math.PI);

        // Color based on safety
        ctx.fillStyle =
          isSafe === null
            ? "#f59e0b"
            : isSafe && safeSequence.includes(process)
            ? "#10b981"
            : "#ef4444";
        ctx.fill();

        // Process label
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(process, x, y);

        // Draw allocation below process
        ctx.font = "12px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText(
          "Alloc: " + allocation[index].join(","),
          x,
          y + processRadius + 20
        );

        // Draw need below allocation
        ctx.fillText(
          "Need: " + need[index].join(","),
          x,
          y + processRadius + 40
        );
      });

      // Draw available resources
      const availableY = 250;
      ctx.font = "14px Arial";
      ctx.fillStyle = "#000000";
      ctx.textAlign = "center";
      ctx.fillText("Sumber Daya Tersedia:", canvas.width / 2, availableY);

      resources.forEach((resource, index) => {
        const x = canvas.width / 2 - 60 + index * 60;
        const y = availableY + 30;

        // Resource box
        ctx.beginPath();
        ctx.rect(x - 20, y - 20, 40, 40);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();

        // Resource label
        ctx.fillStyle = "#ffffff";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(resource, x, y);

        // Available count
        ctx.fillStyle = "#000000";
        ctx.font = "14px Arial";
        ctx.fillText(available[index].toString(), x, y + 30);
      });

      // Draw safe sequence if available
      if (isSafe !== null) {
        const sequenceY = 350;
        ctx.font = "14px Arial";
        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.fillText(
          isSafe ? "Sequence Aman:" : "Tidak ada sequence aman!",
          100,
          sequenceY
        );

        // Draw the sequence with arrows if safe
        if (isSafe) {
          safeSequence.forEach((process, index) => {
            const x = 180 + index * 80;
            const y = sequenceY;

            // Process box
            ctx.beginPath();
            ctx.rect(x - 20, y - 15, 40, 30);
            ctx.fillStyle = "#10b981";
            ctx.fill();

            // Process label
            ctx.fillStyle = "#ffffff";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(process, x, y);

            // Draw arrow if not the last process
            if (index < safeSequence.length - 1) {
              ctx.beginPath();
              ctx.moveTo(x + 25, y);
              ctx.lineTo(x + 55, y);
              ctx.strokeStyle = "#000000";
              ctx.lineWidth = 2;
              ctx.stroke();

              // Arrow head
              ctx.beginPath();
              ctx.moveTo(x + 55, y);
              ctx.lineTo(x + 45, y - 5);
              ctx.lineTo(x + 45, y + 5);
              ctx.closePath();
              ctx.fillStyle = "#000000";
              ctx.fill();
            }
          });
        }
      }
    };

    drawBankersAlgorithm();
  }, [allocation, max, available, isSafe, safeSequence]);

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[600px] h-[400px] mx-auto"
          style={{ touchAction: "none" }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="resource-a">Resource A</Label>
          <Input
            id="resource-a"
            type="number"
            min="0"
            value={available[0]}
            onChange={(e) =>
              updateAvailable(0, Number.parseInt(e.target.value) || 0)
            }
          />
        </div>
        <div>
          <Label htmlFor="resource-b">Resource B</Label>
          <Input
            id="resource-b"
            type="number"
            min="0"
            value={available[1]}
            onChange={(e) =>
              updateAvailable(1, Number.parseInt(e.target.value) || 0)
            }
          />
        </div>
        <div>
          <Label htmlFor="resource-c">Resource C</Label>
          <Input
            id="resource-c"
            type="number"
            min="0"
            value={available[2]}
            onChange={(e) =>
              updateAvailable(2, Number.parseInt(e.target.value) || 0)
            }
          />
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <Button onClick={runBankersAlgorithm}>Periksa Keadaan Aman</Button>
        <Button variant="outline" onClick={resetSimulation}>
          Reset Simulasi
        </Button>
      </div>

      {isSafe !== null && (
        <div
          className={`p-4 rounded-md ${
            isSafe ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isSafe ? (
            <p>
              Sistem dalam keadaan aman. Sequence aman:{" "}
              {safeSequence.join(" → ")}
            </p>
          ) : (
            <p>Sistem dalam keadaan tidak aman! Deadlock mungkin terjadi.</p>
          )}
        </div>
      )}
    </div>
  );
}
