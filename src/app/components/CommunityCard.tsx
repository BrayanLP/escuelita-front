import { createClient } from "@/lib/supabase/server";
import { Community } from "../page";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { use } from "react";

interface Props {
  category?: string;
  search?: string;
}

async function fetchCommunities(category?: string, search?: string) {
  const supabase = await createClient();
  let query = supabase.from("communities").select("*");

  if (category && category !== "Todos") {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return [];
  }

  return data as Community[];
}

export default function CommunityCard({ category, search }: Props) {
  const communities = use(fetchCommunities(category, search));

  return (
    <>
      {communities?.map((c, idx) => (
        <Card key={c.id} className="p-0">
          <Link href={`/community/${c.slug}`}>
            <div className="relative w-full h-36 rounded-t overflow-hidden">
              {c?.banner_url && (
                <img
                  src={c?.banner_url}
                  alt={c?.name}
                  // fill
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
    </>
  );
}
