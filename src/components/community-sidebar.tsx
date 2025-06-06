"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Community {
  id: string;
  name: string;
  description: string;
  banner_url: string;
  members_count: number;
  online_count: number;
  admins_count: number;
  member_count: number;
  admin_count: number;
}

export function CommunitySidebar() {
  const { communityId } = useParams();
  const [community, setCommunity] = useState<Community | null>(null);

  useEffect(() => {
    if (communityId) fetchCommunity(communityId as string);
  }, [communityId]);

  const fetchCommunity = async (slug: string) => {
    const { data } = await supabase
      .from("communities")
      .select("*")
      .eq("slug", slug)
      .single();

    console.log("data fetchCommunity ====>", data);
    if (data) {
      setCommunity({
        ...data,
        online_count: data.online_count ?? 0,
        admins_count: data.admins_count ?? 1,
      });
    }
  };

  if (!community) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-3">
      <img
        src={community.banner_url}
        alt="Comunidad"
        width={280}
        height={160}
        className="rounded w-full"
      />
      <h2 className="text-lg font-semibold">{community.name}</h2>
      <p className="text-sm text-muted-foreground">{community.description}</p>

      <div className="border-t"></div>
      <div className="text-sm space-y-1   grid grid-cols-3">
        <div className="text-center border-r py-3">
          <strong>{community?.member_count || "6.3k"}</strong>
          <br></br> miembros
        </div>
        <div className="text-center  border-r py-3">
          <strong> {community?.online_count || "51"}</strong>
          <br></br> en línea
        </div>
        <div className="text-center  py-3">
          <strong>{community?.admin_count || "2"}</strong>
          <br></br> admins
        </div>
      </div>

      <Button className="w-full mt-4">Invitar personas</Button>
    </div>
  );
}
