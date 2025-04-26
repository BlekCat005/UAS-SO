"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Trash2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Definisikan tipe untuk node
interface NodeBase {
  id: string;
  x: number;
  y: number;
  color: string;
}

interface ProcessNode extends NodeBase {
  isResource?: false;
}

interface ResourceNode extends NodeBase {
  isResource: true;
}

type Node = ProcessNode | ResourceNode;

// Definisikan tipe untuk edge
interface Edge {
  id: string;
  from: string;
  to: string;
  type: "request" | "allocation";
}

export function ResourceAllocationGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processes, setProcesses] = useState<ProcessNode[]>([
    { id: "P0", x: 100, y: 100, color: "#3b82f6" },
    { id: "P1", x: 100, y: 200, color: "#3b82f6" },
  ]);

  const [resources, setResources] = useState<ResourceNode[]>([
    { id: "R0", x: 400, y: 100, color: "#10b981", isResource: true },
    { id: "R1", x: 400, y: 200, color: "#10b981", isResource: true },
  ]);

  const [edges, setEdges] = useState<Edge[]>([]);
  const [isDeadlockDetected, setIsDeadlockDetected] = useState(false);
  const [deadlockPath, setDeadlockPath] = useState<string[]>([]);

  // Form state
  const [newProcessId, setNewProcessId] = useState("");
  const [newResourceId, setNewResourceId] = useState("");
  const [newEdgeFrom, setNewEdgeFrom] = useState("");
  const [newEdgeTo, setNewEdgeTo] = useState("");
  const [newEdgeType, setNewEdgeType] = useState<"request" | "allocation">(
    "request"
  );
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk menambahkan proses baru
  const addProcess = () => {
    if (!newProcessId) {
      setError("ID Proses tidak boleh kosong");
      return;
    }

    if (
      processes.some((p) => p.id === newProcessId) ||
      resources.some((r) => r.id === newProcessId)
    ) {
      setError(`ID '${newProcessId}' sudah digunakan`);
      return;
    }

    const y = 100 + (processes.length % 5) * 60;
    const x = 100 + Math.floor(processes.length / 5) * 150;

    setProcesses([
      ...processes,
      {
        id: newProcessId,
        x,
        y,
        color: "#3b82f6",
      },
    ]);

    setNewProcessId("");
    setError(null);
  };

  // Fungsi untuk menambahkan resource baru
  const addResource = () => {
    if (!newResourceId) {
      setError("ID Resource tidak boleh kosong");
      return;
    }

    if (
      processes.some((p) => p.id === newResourceId) ||
      resources.some((r) => r.id === newResourceId)
    ) {
      setError(`ID '${newResourceId}' sudah digunakan`);
      return;
    }

    const y = 100 + (resources.length % 5) * 60;
    const x = 400 + Math.floor(resources.length / 5) * 150;

    setResources([
      ...resources,
      {
        id: newResourceId,
        x,
        y,
        color: "#10b981",
        isResource: true,
      },
    ]);

    setNewResourceId("");
    setError(null);
  };

  // Fungsi untuk menambahkan edge baru
  const addEdge = () => {
    if (
      !newEdgeFrom ||
      !newEdgeTo ||
      newEdgeFrom === "none" ||
      newEdgeTo === "none"
    ) {
      setError("Pilih node sumber dan tujuan");
      return;
    }

    if (newEdgeFrom === newEdgeTo) {
      setError("Node sumber dan tujuan tidak boleh sama");
      return;
    }

    // Validasi tipe edge berdasarkan node
    const fromIsProcess = processes.some((p) => p.id === newEdgeFrom);
    const toIsProcess = processes.some((p) => p.id === newEdgeTo);
    const fromIsResource = resources.some((r) => r.id === newEdgeFrom);
    const toIsResource = resources.some((r) => r.id === newEdgeTo);

    if (newEdgeType === "request" && (!fromIsProcess || !toIsResource)) {
      setError("Request hanya dapat dibuat dari Proses ke Resource");
      return;
    }

    if (newEdgeType === "allocation" && (!fromIsResource || !toIsProcess)) {
      setError("Allocation hanya dapat dibuat dari Resource ke Proses");
      return;
    }

    // Cek apakah edge sudah ada
    if (edges.some((e) => e.from === newEdgeFrom && e.to === newEdgeTo)) {
      setError("Edge ini sudah ada");
      return;
    }

    const newEdge: Edge = {
      id: `${newEdgeFrom}-${newEdgeTo}`,
      from: newEdgeFrom,
      to: newEdgeTo,
      type: newEdgeType,
    };

    setEdges([...edges, newEdge]);
    setNewEdgeFrom("");
    setNewEdgeTo("");
    setError(null);

    // Reset deadlock status saat graph berubah
    setIsDeadlockDetected(false);
    setDeadlockPath([]);
  };

  // Fungsi untuk menghapus node (proses atau resource)
  const deleteNode = (id: string) => {
    // Hapus node
    if (processes.some((p) => p.id === id)) {
      setProcesses(processes.filter((p) => p.id !== id));
    } else if (resources.some((r) => r.id === id)) {
      setResources(resources.filter((r) => r.id !== id));
    }

    // Hapus semua edge yang terhubung dengan node ini
    setEdges(edges.filter((e) => e.from !== id && e.to !== id));

    // Reset deadlock status
    setIsDeadlockDetected(false);
    setDeadlockPath([]);
  };

  // Fungsi untuk menghapus edge
  const deleteEdge = (id: string) => {
    setEdges(edges.filter((e) => e.id !== id));

    // Reset deadlock status
    setIsDeadlockDetected(false);
    setDeadlockPath([]);
  };

  // Fungsi untuk mendeteksi deadlock menggunakan algoritma deteksi siklus
  const detectDeadlock = () => {
    // Buat wait-for graph (hanya proses ke proses)
    // Proses P1 menunggu proses P2 jika P1 meminta resource yang dialokasikan ke P2
    const waitForGraph: Record<string, string[]> = {};

    // Inisialisasi graph untuk semua proses
    processes.forEach((p) => {
      waitForGraph[p.id] = [];
    });

    // Untuk setiap proses, cari resource yang diminta
    processes.forEach((process) => {
      // Cari semua resource yang diminta oleh proses ini
      const requestedResources = edges
        .filter((e) => e.from === process.id && e.type === "request")
        .map((e) => e.to);

      // Untuk setiap resource yang diminta, cari proses yang memilikinya
      requestedResources.forEach((resourceId) => {
        // Cari proses yang memiliki resource ini
        const holdingProcesses = edges
          .filter((e) => e.to === resourceId && e.type === "allocation")
          .map((e) => e.from)
          .flatMap((resourceId) =>
            edges
              .filter((e) => e.from === resourceId && e.type === "allocation")
              .map((e) => e.to)
          );

        // Tambahkan edge wait-for dari proses ini ke proses yang memiliki resource
        holdingProcesses.forEach((holdingProcess) => {
          if (!waitForGraph[process.id].includes(holdingProcess)) {
            waitForGraph[process.id].push(holdingProcess);
          }
        });
      });
    });

    // Fungsi untuk mencari siklus dengan DFS
    const findCycle = () => {
      const visited: Record<string, boolean> = {};
      const recStack: Record<string, boolean> = {};

      const dfs = (node: string, path: string[] = []): [boolean, string[]] => {
        // Jika node sudah ada di recStack, berarti ada siklus
        if (recStack[node]) {
          return [true, [...path, node]];
        }

        // Jika node sudah dikunjungi dan tidak ada di recStack, tidak ada siklus
        if (visited[node]) {
          return [false, []];
        }

        // Tandai node sebagai dikunjungi dan tambahkan ke recStack
        visited[node] = true;
        recStack[node] = true;

        // Periksa semua tetangga
        for (const neighbor of waitForGraph[node] || []) {
          const [hasCycle, cyclePath] = dfs(neighbor, [...path, node]);
          if (hasCycle) {
            // Jika siklus ditemukan, kembalikan jalur siklus
            return [true, cyclePath];
          }
        }

        // Hapus node dari recStack dan kembalikan false
        recStack[node] = false;
        return [false, []];
      };

      // Cek dari setiap proses
      for (const processId of Object.keys(waitForGraph)) {
        const [hasCycle, cyclePath] = dfs(processId);
        if (hasCycle) {
          // Temukan indeks awal siklus
          const startIdx = cyclePath.indexOf(cyclePath[cyclePath.length - 1]);
          // Ekstrak siklus dari jalur
          const cycle = cyclePath.slice(startIdx);
          return [true, cycle];
        }
      }

      return [false, []];
    };

    // Cari siklus di wait-for graph
    const [hasDeadlock, deadlockCycle] = findCycle();

    // Jika tidak ada siklus di wait-for graph, coba cari siklus di resource allocation graph
    if (!hasDeadlock) {
      // Buat resource allocation graph
      const raGraph: Record<string, string[]> = {};

      // Inisialisasi graph
      processes.forEach((p) => {
        raGraph[p.id] = [];
      });

      resources.forEach((r) => {
        raGraph[r.id] = [];
      });

      // Tambahkan edge ke graph
      edges.forEach((edge) => {
        raGraph[edge.from].push(edge.to);
      });

      // Fungsi untuk mencari siklus dengan DFS di RAG
      const findCycleInRAG = () => {
        const visited: Record<string, boolean> = {};
        const recStack: Record<string, boolean> = {};

        const dfs = (
          node: string,
          path: string[] = []
        ): [boolean, string[]] => {
          // Jika node sudah ada di recStack, berarti ada siklus
          if (recStack[node]) {
            return [true, [...path, node]];
          }

          // Jika node sudah dikunjungi dan tidak ada di recStack, tidak ada siklus
          if (visited[node]) {
            return [false, []];
          }

          // Tandai node sebagai dikunjungi dan tambahkan ke recStack
          visited[node] = true;
          recStack[node] = true;

          // Periksa semua tetangga
          for (const neighbor of raGraph[node] || []) {
            const [hasCycle, cyclePath] = dfs(neighbor, [...path, node]);
            if (hasCycle) {
              // Jika siklus ditemukan, kembalikan jalur siklus
              return [true, cyclePath];
            }
          }

          // Hapus node dari recStack dan kembalikan false
          recStack[node] = false;
          return [false, []];
        };

        // Cek dari setiap node
        for (const nodeId of Object.keys(raGraph)) {
          const [hasCycle, cyclePath] = dfs(nodeId);
          if (hasCycle) {
            // Temukan indeks awal siklus
            const startIdx = cyclePath.indexOf(cyclePath[cyclePath.length - 1]);
            // Ekstrak siklus dari jalur
            const cycle = cyclePath.slice(startIdx);
            return [true, cycle];
          }
        }

        return [false, []];
      };

      const [hasRAGDeadlock, ragDeadlockCycle] = findCycleInRAG();

      if (hasRAGDeadlock) {
        setIsDeadlockDetected(true);
        setDeadlockPath(ragDeadlockCycle);

        // Perbarui warna node yang terlibat dalam deadlock
        const updatedProcesses = processes.map((p) => ({
          ...p,
          color: ragDeadlockCycle.includes(p.id) ? "#ef4444" : "#3b82f6",
        }));

        const updatedResources = resources.map((r) => ({
          ...r,
          color: ragDeadlockCycle.includes(r.id) ? "#ef4444" : "#10b981",
        }));

        setProcesses(updatedProcesses);
        setResources(updatedResources);
      } else {
        setIsDeadlockDetected(false);
        setDeadlockPath([]);
        setError("Tidak ada deadlock yang terdeteksi");

        // Kembalikan warna semua node
        const updatedProcesses = processes.map((p) => ({
          ...p,
          color: "#3b82f6",
        }));

        const updatedResources = resources.map((r) => ({
          ...r,
          color: "#10b981",
        }));

        setProcesses(updatedProcesses);
        setResources(updatedResources);
      }
    } else {
      // Konversi siklus wait-for menjadi siklus lengkap dengan resource
      const fullCycle: string[] = [];

      for (let i = 0; i < deadlockCycle.length; i++) {
        const currentProcess = deadlockCycle[i];
        const nextProcess = deadlockCycle[(i + 1) % deadlockCycle.length];

        fullCycle.push(currentProcess);

        // Cari resource yang diminta oleh currentProcess dan dimiliki oleh nextProcess
        const requestedResources = edges
          .filter((e) => e.from === currentProcess && e.type === "request")
          .map((e) => e.to);

        const resourcesHeldByNext = edges
          .filter((e) => e.to === nextProcess && e.type === "allocation")
          .map((e) => e.from);

        // Cari resource yang diminta oleh currentProcess dan dimiliki oleh nextProcess
        for (const resource of requestedResources) {
          if (resourcesHeldByNext.includes(resource)) {
            fullCycle.push(resource);
            break;
          }
        }
      }

      setIsDeadlockDetected(true);
      setDeadlockPath(fullCycle);

      // Perbarui warna node yang terlibat dalam deadlock
      const updatedProcesses = processes.map((p) => ({
        ...p,
        color: fullCycle.includes(p.id) ? "#ef4444" : "#3b82f6",
      }));

      const updatedResources = resources.map((r) => ({
        ...r,
        color: fullCycle.includes(r.id) ? "#ef4444" : "#10b981",
      }));

      setProcesses(updatedProcesses);
      setResources(updatedResources);
    }
  };

  // Fungsi untuk reset simulasi
  const resetSimulation = () => {
    setIsDeadlockDetected(false);
    setDeadlockPath([]);
    setError(null);

    // Kembalikan warna semua node
    const updatedProcesses = processes.map((p) => ({
      ...p,
      color: "#3b82f6",
    }));

    const updatedResources = resources.map((r) => ({
      ...r,
      color: "#10b981",
    }));

    setProcesses(updatedProcesses);
    setResources(updatedResources);
  };

  // Fungsi untuk reset seluruh graph
  const resetGraph = () => {
    setProcesses([]);
    setResources([]);
    setEdges([]);
    setIsDeadlockDetected(false);
    setDeadlockPath([]);
    setError(null);
  };

  // Fungsi untuk membuat contoh deadlock
  const createDeadlockExample = () => {
    // Reset graph
    resetGraph();

    // Buat proses dan resource
    const newProcesses: ProcessNode[] = [
      { id: "P1", x: 100, y: 100, color: "#3b82f6" },
      { id: "P2", x: 100, y: 200, color: "#3b82f6" },
    ];

    const newResources: ResourceNode[] = [
      { id: "R1", x: 400, y: 100, color: "#10b981", isResource: true },
      { id: "R2", x: 400, y: 200, color: "#10b981", isResource: true },
    ];

    // Buat edge
    const newEdges: Edge[] = [
      { id: "R1-P1", from: "R1", to: "P1", type: "allocation" },
      { id: "R2-P2", from: "R2", to: "P2", type: "allocation" },
      { id: "P1-R2", from: "P1", to: "R2", type: "request" },
      { id: "P2-R1", from: "P2", to: "R1", type: "request" },
    ];

    setProcesses(newProcesses);
    setResources(newResources);
    setEdges(newEdges);
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

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = [...processes, ...resources].find(
        (n) => n.id === edge.from
      );
      const toNode = [...processes, ...resources].find((n) => n.id === edge.to);

      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);

      // Style based on edge type and deadlock status
      const isDeadlockEdge =
        isDeadlockDetected &&
        deadlockPath.includes(edge.from) &&
        deadlockPath.includes(edge.to) &&
        deadlockPath.indexOf(edge.to) ===
          (deadlockPath.indexOf(edge.from) + 1) % deadlockPath.length;

      if (isDeadlockEdge) {
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 3;
      } else if (edge.type === "request") {
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 2;
      }

      ctx.stroke();

      // Draw arrow
      const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
      const arrowSize = 10;

      ctx.beginPath();
      ctx.moveTo(
        toNode.x - arrowSize * Math.cos(angle - Math.PI / 6),
        toNode.y - arrowSize * Math.sin(angle - Math.PI / 6)
      );
      ctx.lineTo(toNode.x, toNode.y);
      ctx.lineTo(
        toNode.x - arrowSize * Math.cos(angle + Math.PI / 6),
        toNode.y - arrowSize * Math.sin(angle + Math.PI / 6)
      );
      ctx.fillStyle = isDeadlockEdge
        ? "#ef4444"
        : edge.type === "request"
        ? "#f59e0b"
        : "#22c55e";
      ctx.fill();
    });

    // Draw nodes
    const allNodes: Node[] = [...processes, ...resources];
    allNodes.forEach((node) => {
      ctx.beginPath();
      if (node.isResource) {
        // Draw rectangle for resources
        ctx.rect(node.x - 20, node.y - 20, 40, 40);
      } else {
        // Draw circle for processes
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      }

      ctx.fillStyle = node.color;
      ctx.fill();

      // Draw node label
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.id, node.x, node.y);
    });

    // Draw legend
    ctx.font = "12px Arial";
    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";

    ctx.fillText("Legend:", 480, 100);

    // Process node
    ctx.beginPath();
    ctx.arc(500, 120, 10, 0, 2 * Math.PI);
    ctx.fillStyle = "#3b82f6";
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.fillText("Process", 520, 120);

    // Resource node
    ctx.beginPath();
    ctx.rect(490, 140, 20, 20);
    ctx.fillStyle = "#10b981";
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.fillText("Resource", 520, 150);

    // Request edge
    ctx.beginPath();
    ctx.moveTo(490, 180);
    ctx.lineTo(510, 180);
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#000000";
    ctx.fillText("Request", 520, 180);

    // Allocation edge
    ctx.beginPath();
    ctx.moveTo(490, 200);
    ctx.lineTo(510, 200);
    ctx.strokeStyle = "#22c55e";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = "#000000";
    ctx.fillText("Allocation", 520, 200);

    // Tampilkan status deadlock jika terdeteksi
    if (isDeadlockDetected) {
      ctx.font = "16px Arial";
      ctx.fillStyle = "#ef4444";
      ctx.textAlign = "center";
      ctx.fillText("Deadlock Terdeteksi!", canvas.width / 2, 350);
      ctx.fillText(
        `Siklus: ${deadlockPath.join(" → ")}`,
        canvas.width / 2,
        375
      );
    }
  }, [processes, resources, edges, isDeadlockDetected, deadlockPath]);

  return (
    <div className="space-y-6">
      <div className="border rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[600px] h-[400px] mx-auto"
          style={{ touchAction: "none" }}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button onClick={detectDeadlock}>Deteksi Deadlock</Button>
        <Button variant="outline" onClick={resetSimulation}>
          Reset Simulasi
        </Button>
        <Button variant="destructive" onClick={resetGraph}>
          Reset Graph
        </Button>
        <Button variant="secondary" onClick={createDeadlockExample}>
          Contoh Deadlock
        </Button>
      </div>

      {error && (
        <Alert
          variant={
            error.includes("Tidak ada deadlock") ? "default" : "destructive"
          }
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {error.includes("Tidak ada deadlock") ? "Informasi" : "Error"}
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isDeadlockDetected && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Deadlock Terdeteksi!</AlertTitle>
          <AlertDescription>
            Ditemukan siklus: {deadlockPath.join(" → ")}
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="add-nodes">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="add-nodes">Tambah Node</TabsTrigger>
          <TabsTrigger value="add-edges">Tambah Edge</TabsTrigger>
          <TabsTrigger value="manage">Kelola Graph</TabsTrigger>
        </TabsList>

        <TabsContent value="add-nodes" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Tambah Proses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="process-id">ID Proses</Label>
                    <Input
                      id="process-id"
                      value={newProcessId}
                      onChange={(e) => setNewProcessId(e.target.value)}
                      placeholder="P0, P1, ..."
                    />
                  </div>
                  <Button onClick={addProcess}>Tambah</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tambah Resource</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="resource-id">ID Resource</Label>
                    <Input
                      id="resource-id"
                      value={newResourceId}
                      onChange={(e) => setNewResourceId(e.target.value)}
                      placeholder="R0, R1, ..."
                    />
                  </div>
                  <Button onClick={addResource}>Tambah</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="add-edges" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tambah Edge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="edge-from">Dari Node</Label>
                  <Select value={newEdgeFrom} onValueChange={setNewEdgeFrom}>
                    <SelectTrigger id="edge-from">
                      <SelectValue placeholder="Pilih node sumber" />
                    </SelectTrigger>
                    <SelectContent>
                      {processes.map((p) => (
                        <SelectItem key={`from-${p.id}`} value={p.id}>
                          {p.id} (Proses)
                        </SelectItem>
                      ))}
                      {resources.map((r) => (
                        <SelectItem key={`from-${r.id}`} value={r.id}>
                          {r.id} (Resource)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edge-to">Ke Node</Label>
                  <Select value={newEdgeTo} onValueChange={setNewEdgeTo}>
                    <SelectTrigger id="edge-to">
                      <SelectValue placeholder="Pilih node tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {processes.map((p) => (
                        <SelectItem key={`to-${p.id}`} value={p.id}>
                          {p.id} (Proses)
                        </SelectItem>
                      ))}
                      {resources.map((r) => (
                        <SelectItem key={`to-${r.id}`} value={r.id}>
                          {r.id} (Resource)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-4">
                <Label htmlFor="edge-type">Tipe Edge</Label>
                <Select
                  value={newEdgeType}
                  onValueChange={(value) =>
                    setNewEdgeType(value as "request" | "allocation")
                  }
                >
                  <SelectTrigger id="edge-type">
                    <SelectValue placeholder="Pilih tipe edge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="request">
                      Request (Proses → Resource)
                    </SelectItem>
                    <SelectItem value="allocation">
                      Allocation (Resource → Proses)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={addEdge} className="w-full">
                Tambah Edge
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Node</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {processes.length === 0 && resources.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Belum ada node
                    </p>
                  )}

                  {processes.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <span>{p.id} (Proses)</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNode(p.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  {resources.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <span>{r.id} (Resource)</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNode(r.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daftar Edge</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {edges.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Belum ada edge
                    </p>
                  )}

                  {edges.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <span>
                        {e.from} → {e.to} (
                        {e.type === "request" ? "Request" : "Allocation"})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEdge(e.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
