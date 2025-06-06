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
        <SearchInput placeholder="Busca lo que quieras..." />
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
