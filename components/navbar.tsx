import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Deadlock Simulator
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/detection"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Detection
          </Link>
          <Link
            href="/prevention"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Prevention
          </Link>
          <Link
            href="/avoidance"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Avoidance
          </Link>
          <Link
            href="/recovery"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Recovery
          </Link>
          <Link
            href="/ignorance"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Ignorance
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
