import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { EscuelitaLogo } from "./components/Icons";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-muted">
      <header className="flex items-center justify-between p-4 border-b bg-white">
        {/* <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          <span className="font-semibold">Escuelita</span>
        </div> */}
        <Link
          href="/"
          className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
        >
          <EscuelitaLogo className="h-7 w-7" />
          <span className="text-xl font-headline font-semibold">Escuelita</span>
        </Link>
        <Button variant="outline" size="sm">
          Iniciar sesión
        </Button>
      </header>

      <main className="p-6 grid lg:grid-cols-[2fr_1fr] gap-6 max-w-6xl mx-auto">
        <section className="bg-white p-4 rounded-lg shadow-md">
          <Image
            src="/banners/ai-accelerator.png"
            alt="Banner"
            width={800}
            height={300}
            className="rounded-lg mb-4"
          />
          <h1 className="text-2xl font-bold">AI Accelerator</h1>
        </section>

        <aside className="bg-white p-4 rounded-lg shadow-md space-y-3">
          <Image
            src="/banners/ai-accelerator.png"
            alt="Mini banner"
            width={300}
            height={150}
            className="rounded"
          />
          <h2 className="text-lg font-semibold">AI Accelerator</h2>
          <p className="text-sm text-muted-foreground">
            Una comunidad para dominar agentes de IA y automatización.
          </p>
          <div className="text-sm">
            🔒 Privado • 👥 6.1k miembros • 🆓 Gratis
          </div>
          <Button className="w-full">Unirme al grupo</Button>
        </aside>
      </main>

      <footer className="text-center py-4 text-sm text-muted-foreground">
        powered by <span className="font-bold text-primary">escuelita</span>
      </footer>
    </div>
  );
}
