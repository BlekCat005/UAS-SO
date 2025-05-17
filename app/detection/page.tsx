import { ResourceAllocationGraph } from "@/components/resource-allocation-graph";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DeadlockDetectionPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Deadlock Detection</h1>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="mx-auto">Resource Allocation Graph</CardTitle>
            <CardDescription className="mx-auto">
              Buat dan visualisasikan resource allocation graph untuk mendeteksi
              deadlock
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResourceAllocationGraph />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tentang Deadlock Detection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Deadlock detection adalah strategi di mana sistem mengizinkan
              deadlock terjadi tetapi memiliki mekanisme untuk mendeteksinya
              ketika terjadi. Algoritma deteksi biasanya menggunakan resource
              allocation graph atau struktur data serupa untuk mengidentifikasi
              siklus yang mengindikasikan deadlock.
            </p>

            <h3 className="text-lg font-medium mt-4 mb-2">
              Cara Menggunakan Simulator:
            </h3>
            <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
              <li>
                Tambahkan node proses dan resource menggunakan tab "Tambah Node"
              </li>
              <li>Buat koneksi antar node menggunakan tab "Tambah Edge"</li>
              <li>
                Gunakan tombol "Deteksi Deadlock" untuk memeriksa apakah
                terdapat deadlock
              </li>
              <li>
                Jika deadlock terdeteksi, siklus akan ditampilkan dan node yang
                terlibat akan berwarna merah
              </li>
              <li>
                Gunakan tombol "Reset Simulasi" untuk menghapus status deadlock
              </li>
              <li>
                Gunakan tombol "Reset Graph" untuk menghapus semua node dan edge
              </li>
            </ol>

            <h3 className="text-lg font-medium mt-4 mb-2">Contoh Deadlock:</h3>
            <p className="text-muted-foreground">
              Buat siklus seperti: P1 → R1 → P2 → R2 → P1 (di mana P adalah
              proses dan R adalah resource)
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
