"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function CommunityAboutPage() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunity = async () => {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .eq("slug", communityId)
        .single();

      if (error) {
        console.error("Error al obtener la comunidad:", error.message);
      } else {
        setCommunity(data);
      }

      setLoading(false);
    };

    if (communityId) fetchCommunity();
  }, [communityId]);

  if (loading) return <p>Cargando...</p>;
  if (!community) return <p>Comunidad no encontrada.</p>;

  return (
    <div className="max-w-3xl space-y-6">
      {community.banner_url && (
        <img
          src={community.banner_url}
          alt="Banner"
          className="w-full h-40 object-cover rounded-lg"
        />
      )}

      <div className="flex items-center gap-4">
        {community.logo_url && (
          <img
            src={community.logo_url}
            alt="Logo"
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold">{community.name}</h1>
          <p className="text-muted-foreground">{community.slug}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Sobre la comunidad</h2>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {community.description || "Esta comunidad aún no tiene descripción."}
        </p>
      </div>
    </div>
  );
}
