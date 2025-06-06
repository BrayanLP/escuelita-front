"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "./auth-provider";

type Community = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
};

type CommunityContextType = {
  community: Community | null;
  loading: boolean;
  exitsUserPermission: boolean;
  existCommunity: boolean;
};

const CommunityContext = createContext<CommunityContextType | undefined>(
  undefined
);

export const CommunityProvider = ({ children }: { children: ReactNode }) => {
  const { communityId } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [existCommunity, setExistCommunity] = useState(false);
  const [exitsUserPermission, setExitsUserPermission] = useState(false);

  useEffect(() => {
    async function fetchCommunity() {
      setLoading(true);
      setExistCommunity(false);
      setExitsUserPermission(false);

      // 1. Buscar comunidad por slug
      const { data: communityData, error: communityError } = await supabase
        .from("communities")
        .select(
          "*, creator:profiles!communities_user_id_fkey(full_name, avatar_url)"
        )
        .eq("slug", communityId)
        .single();

      if (communityError || !communityData) {
        console.error("Comunidad no encontrada");
        setLoading(false);
        return;
      }

      setCommunity(communityData);
      setExistCommunity(true);

      // 2. Si no hay usuario, solo devolver datos públicos
      if (!user) {
        setLoading(false);
        return;
      }

      // 3. Validar membresía
      const { data: member, error: memberError } = await supabase
        .from("community_members")
        .select("id")
        .eq("community_id", communityData.id)
        .eq("profile_id", user.id)
        .maybeSingle();

      if (!member || memberError) {
        setExitsUserPermission(false);
      } else {
        setExitsUserPermission(true);
      }

      setLoading(false);
    }

    fetchCommunity();
  }, [communityId, user?.id]);

  return (
    <CommunityContext.Provider
      value={{ community, loading, exitsUserPermission, existCommunity }}
    >
      {children}
    </CommunityContext.Provider>
  );
};

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) {
    throw new Error("useCommunity debe usarse dentro de <CommunityProvider>");
  }
  return context;
};
