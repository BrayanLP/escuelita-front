
import Link from "next/link";
import { SearchCommunitiesByCategory } from "./components/SearchCommunitiesByCategory";
import CommunityCard from "./components/CommunityCard";
import { Suspense, use } from "react";
import LoadingCard from "./components/LoadingCard";
import { SearchInput } from "./components/SearchInput";

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url: string;
  banner_url: string;
  category: string;
  members_count: number;
  price: string;
}

const categories = [
  "Todos",
  "Hobbies",
  "Música",
  "Dinero",
  "Espiritu",
  "Tecnología",
  "Salud",
  "Deporte",
  "IA",
  // "Self-improvement",
  // "Relationships",
];

interface Props {
  searchParams: Promise<{
    category?: string;
    search?: string;
  }>;
}

export default function DiscoverPage({ searchParams }: Props) {
  const { category, search } = use(searchParams);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 flex-1 h-auto">
      <h1 className="text-3xl font-bold text-center">
        Descubre las comunidades
      </h1>
      <p className="text-center text-sm text-muted-foreground">
        or{" "}
        <Link href="/create" className="text-blue-600 underline">
          Crear tu propia comunidad
        </Link>
      </p>

      <div className="max-w-md mx-auto">
        <SearchInput 
          placeholder="Busca lo que quieras..."
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <SearchCommunitiesByCategory key={cat} category={cat} />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Suspense fallback={<LoadingCard />} key={`${category}-${search}`}>
            <CommunityCard category={category} search={search} />
          </Suspense>
      </div>
    </div>
  );
}

// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { EscuelitaLogo } from "./components/Icons";

// export default function HomePage() {
//   return (
//     <div className="min-h-screen bg-muted">
//       <header className="flex items-center justify-between p-4 border-b bg-white">
//         <Link
//           href="/"
//           className="flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
//         >
//           <EscuelitaLogo className="h-7 w-7" />
//           <span className="text-xl font-headline font-semibold">Escuelita</span>
//         </Link>
//         <Button variant="outline" size="sm">
//           <Link href="/auth/login">Iniciar sesión</Link>
//         </Button>
//       </header>

//       <main className="p-6 grid lg:grid-cols-[2fr_1fr] gap-6 max-w-6xl mx-auto">
//         <section className="bg-white p-4 rounded-lg shadow-md">
//           <Image
//             src="/banners/ai-accelerator.png"
//             alt="Banner"
//             width={800}
//             height={300}
//             className="rounded-lg mb-4"
//           />
//           <h1 className="text-2xl font-bold">AI Accelerator</h1>
//         </section>

//         <aside className="bg-white p-4 rounded-lg shadow-md space-y-3">
//           <Image
//             src="/banners/ai-accelerator.png"
//             alt="Mini banner"
//             width={300}
//             height={150}
//             className="rounded"
//           />
//           <h2 className="text-lg font-semibold">AI Accelerator</h2>
//           <p className="text-sm text-muted-foreground">
//             Una comunidad para dominar agentes de IA y automatización.
//           </p>
//           <div className="text-sm">
//             🔒 Privado • 👥 6.1k miembros • 🆓 Gratis
//           </div>
//           <Button className="w-full">Unirme al grupo</Button>
//         </aside>
//       </main>

//       <footer className="text-center py-4 text-sm text-muted-foreground">
//         powered by <span className="font-bold text-primary">escuelita</span>
//       </footer>
//     </div>
//   );
// }
