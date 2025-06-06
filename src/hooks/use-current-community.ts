// "use client";

// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase/client";
// import { useAuth } from "@/context/auth-provider";

// export function useCurrentCommunity() {
//   const { communityId } = useParams();
//   const { user } = useAuth();
//   const router = useRouter();

//   const [community, setCommunity] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchCommunity() {
//       if (!user || !communityId) return;

//       // 1. Buscar comunidad por slug o id
//       const { data: communityData, error: communityError } = await supabase
//         .from("communities")
//         .select("*")
//         .eq("id", communityId)
//         .single();

//       if (communityError || !communityData) {
//         router.push("/");
//         return;
//       }

//       // 2. Validar si el usuario es miembro
//       const { data: member, error: memberError } = await supabase
//         .from("community_members")
//         .select("*")
//         .eq("community_id", communityData.id)
//         .eq("profile_id", user.id)
//         .maybeSingle();

//       if (memberError || !member) {
//         router.push("/");
//         return;
//       }

//       setCommunity(communityData);
//       setLoading(false);
//     }

//     fetchCommunity();
//   }, [communityId, user?.id]);

//   return { community, loading };
// }
