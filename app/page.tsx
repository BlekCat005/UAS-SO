import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Lock,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Deadlock Simulation System
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Visualisasi Interaktif
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SimulationCard
          title="Deadlock Detection"
          description="Visualize how deadlocks occur and how to detect them in resource allocation graphs"
          icon={<Lock className="h-8 w-8 text-red-500" />}
          href="/detection"
        />

        <SimulationCard
          title="Deadlock Prevention"
          description="Explore techniques to prevent deadlocks by denying one of the four necessary conditions"
          icon={<ShieldAlert className="h-8 w-8 text-blue-500" />}
          href="/prevention"
        />

        <SimulationCard
          title="Deadlock Avoidance"
          description="Simulate the Banker's Algorithm and safe state analysis to avoid deadlocks"
          icon={<ShieldCheck className="h-8 w-8 text-green-500" />}
          href="/avoidance"
        />

        <SimulationCard
          title="Deadlock Recovery"
          description="Learn how systems can recover from deadlocks through process termination or resource preemption"
          icon={<AlertTriangle className="h-8 w-8 text-yellow-500" />}
          href="/recovery"
        />

        <SimulationCard
          title="Deadlock Ignorance"
          description="Understand the ostrich algorithm and when ignoring deadlocks might be appropriate"
          icon={<XCircle className="h-8 w-8 text-purple-500" />}
          href="/ignorance"
        />
      </div>
    </main>
  );
}

interface PropTypes {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function SimulationCard(props: PropTypes) {
  const { title, description, icon, href } = props;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-4">
          {description}
        </CardDescription>
        <Link href={href}>
          <Button className="w-full">
            Explore <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
