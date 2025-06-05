"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Community {
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

export default function DiscoverPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filtered, setFiltered] = useState<Community[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    const { data } = await supabase
      .from("communities")
      .select("*")
      .eq("is_public", true);

    setCommunities(data || []);
    setFiltered(data || []);
  };

  useEffect(() => {
    let list = [...communities];

    if (selectedCategory !== "All") {
      list = list.filter((c) => c.category === selectedCategory);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(s) ||
          c.description.toLowerCase().includes(s)
      );
    }

    setFiltered(list);
  }, [selectedCategory, search, communities]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Descrubre las comunidades
      </h1>
      <p className="text-center text-sm text-muted-foreground">
        or{" "}
        <Link href="/create" className="text-blue-600 underline">
          Crear tu propia comunidad
        </Link>
      </p>

      <div className="max-w-md mx-auto">
        <Input
          placeholder="Busca lo que quieras..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <Badge
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            variant={selectedCategory === cat ? "default" : "outline"}
            className="cursor-pointer"
          >
            {cat}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((c, idx) => (
          <Card key={c.id} className="p-0">
            <Link href={`/community/${c.slug}`}>
              <div className="relative w-full h-36 rounded-t overflow-hidden">
                {c?.banner_url && (
                  <img
                    src={c?.banner_url}
                    alt={c?.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2">
                  {c.logo_url && (
                    <img
                      src={c.logo_url}
                      alt="Logo"
                      width={24}
                      height={24}
                      className="rounded"
                    />
                  )}
                  <h2 className="font-semibold text-sm">{c.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {c.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {c.members_count} Members • {c.price}
                </p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </main>
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
