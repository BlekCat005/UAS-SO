"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BankersAlgorithm } from "@/components/bankers-algorithm";
import { Input } from "@/components/ui/input";

export default function DeadlockAvoidancePage() {
  const [allocation, setAllocation] = useState([
    [0, 1, 0], // P0
    [2, 0, 0], // P1
    [3, 0, 2], // P2
    [2, 1, 1], // P3
    [0, 0, 2], // P4
  ]);

  const [maxNeed, setMaxNeed] = useState([
    [7, 5, 3], // P0
    [3, 2, 2], // P1
    [9, 0, 2], // P2
    [2, 2, 2], // P3
    [4, 3, 3], // P4
  ]);

  const [available, setAvailable] = useState([3, 3, 2]);
  const [safeState, setSafeState] = useState<string | null>(null);
  const [safeSequence, setSafeSequence] = useState<number[]>([]);

  // Fungsi untuk memeriksa keadaan aman
  const checkSafeState = () => {
    // Hitung need matrix
    const need = allocation.map((row, i) =>
      row.map((val, j) => maxNeed[i][j] - val)
    );

    // Inisialisasi work dan finish
    const work = [...available];
    const finish = Array(allocation.length).fill(false);
    const sequence: number[] = [];

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
            sequence.push(i);

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

    setSafeSequence(sequence);
    if (safe) {
      setSafeState(
        `Sistem dalam keadaan aman. Sequence aman: P${sequence.join(" → P")}`
      );
    } else {
      setSafeState(
        "Sistem dalam keadaan tidak aman! Deadlock mungkin terjadi."
      );
    }
  };

  // Reset simulasi
  const resetSimulation = () => {
    setSafeState(null);
    setSafeSequence([]);
  };

  // Update available resources
  const updateAvailable = (index: number, value: number) => {
    const newAvailable = [...available];
    newAvailable[index] = value;
    setAvailable(newAvailable);
    // Reset safety status when resources change
    setSafeState(null);
    setSafeSequence([]);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Deadlock Avoidance</h1>

      <div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="mx-auto">
                Simulasi Algoritma Banker
              </CardTitle>
              <CardDescription className="mx-auto">
                Visualisasi Algoritma Banker untuk penghindaran deadlock
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BankersAlgorithm />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Tabel Alokasi Sumber Daya</CardTitle>
              <CardDescription>
                Alokasi saat ini dan kebutuhan maksimum
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Matriks Alokasi</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proses</TableHead>
                        <TableHead>Sumber Daya A</TableHead>
                        <TableHead>Sumber Daya B</TableHead>
                        <TableHead>Sumber Daya C</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allocation.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>P{i}</TableCell>
                          {row.map((val, j) => (
                            <TableCell key={j}>{val}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Matriks Kebutuhan Maksimum
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proses</TableHead>
                        <TableHead>Sumber Daya A</TableHead>
                        <TableHead>Sumber Daya B</TableHead>
                        <TableHead>Sumber Daya C</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maxNeed.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell>P{i}</TableCell>
                          {row.map((val, j) => (
                            <TableCell key={j}>{val}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tentang Penghindaran Deadlock</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Penghindaran deadlock adalah strategi di mana sistem secara dinamis
            memeriksa permintaan alokasi sumber daya untuk memastikan bahwa
            mengabulkan permintaan tidak akan menyebabkan deadlock. Algoritma
            Banker adalah algoritma penghindaran deadlock yang umum yang
            mempertahankan informasi tentang sumber daya yang tersedia, sumber
            daya yang dialokasikan, dan permintaan maksimum untuk menentukan
            apakah sistem berada dalam keadaan aman.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
