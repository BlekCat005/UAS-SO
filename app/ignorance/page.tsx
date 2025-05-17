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
                Visualisasikan bagaimana sistem membiarkan deadlock terjadi
                tanpa penanganan
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
          <CardTitle>Keuntungan dan Kerugian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2 text-green-600">
                Keuntungan
              </h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>Tidak ada overhead untuk pencegahan atau deteksi</li>
                <li>Implementasi yang sederhana</li>
                <li>Penggunaan resource maksimal</li>
                <li>Kinerja baik ketika deadlock jarang terjadi</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2 text-red-600">
                Kerugian
              </h3>
              <ul className="list-disc pl-5 text-muted-foreground space-y-2">
                <li>Tidak ada perlindungan terhadap deadlock</li>
                <li>Sulit untuk debug saat deadlock terjadi</li>
                <li>Dapat menyebabkan perilaku sistem yang tidak terduga</li>
                <li>Tidak cocok untuk sistem kritis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
