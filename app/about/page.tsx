import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Pastikan path ini sesuai

interface TeamMember {
  name: string;
  npm: string;
}

const teamMembers: TeamMember[] = [
  { name: "Muhamad Rizki", npm: "237006085" },
  { name: "Aar Lazuardi Majid", npm: "237006070" },
  { name: "Farha Fadila Amalia", npm: "237006072" },
  { name: "Fenty Anggraeni", npm: "237006068" },
];

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-8 flex flex-col flex-grow">
      <h1 className="text-3xl font-bold mb-8 text-center">Anggota Kelompok</h1>
      {/*
        Gunakan flex-grow pada parent dari grid agar grid bisa mengambil
        sisa ruang vertikal.
        Pastikan juga layout utama (di layout.tsx atau komponen parent)
        memungkinkan konten untuk tumbuh (misalnya dengan min-h-screen pada body
        dan flex-col pada children).
      */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
        {teamMembers.map((member) => (
          <Card
            key={member.npm}
            className="shadow-lg flex flex-col justify-center items-center" // Tambahkan flex untuk centering konten di dalam card
          >
            <CardHeader className="pb-2">
              {" "}
              {/* Kurangi padding bawah header jika perlu */}
              <CardTitle className="text-2xl md:text-3xl text-center">
                {member.name}
              </CardTitle>{" "}
              {/* Besarkan font title */}
            </CardHeader>
            <CardContent>
              <p className="text-lg md:text-xl text-center text-muted-foreground">
                {member.npm}
              </p>{" "}
              {/* Besarkan font NPM */}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
