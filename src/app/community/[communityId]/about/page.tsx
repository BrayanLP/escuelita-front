"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Users, Tag, User } from "lucide-react";
import { useAuth } from "@/context/auth-provider";
import { JoinCommunityModal } from "@/components/join-community-modal";
export default function CommunityAboutPage() {
  const { communityId } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [community, setCommunity] = useState<any | null>(null);
  const [member, setMember] = useState<any | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({
    memberCount: "6.3k",
    // isFree: true,
    ownerName: "Nick Puruczky",
    ownerAvatar: "/avatar.jpg",
  });
  useEffect(() => {
    const fetch = async () => {
      // const { data: user } = await supabase.auth.getUser();

      const { data: community } = await supabase
        .from("communities")
        .select("*, profile:profiles!communities_user_id_fkey(full_name)")
        .eq("slug", communityId)
        .single();

      if (!community) {
        router.push("/");
        return;
      }

      setCommunity(community);

      supabase
        .from("community_subscriptions")
        .select("*")
        .eq("community_id", community.id)
        .eq("user_id", user?.id)
        .maybeSingle()
        .then(({ data }) => {
          console.log("data", data);
          // setExistingRequest(!!data);
        });

      console.log("user", user);
      if (user?.id) {
        const { data: member } = await supabase
          .from("community_members")
          .select("id, roles(*)")
          .eq("community_id", community.id)
          .eq("profile_id", user.id)
          .maybeSingle();

        setMember(member);
        if (member) {
          // router.push(`/community/${communityId}`);
          return;
        }
      }

      setIsMember(false);
      setLoading(false);
    };

    fetch();
  }, [communityId]);

  if (!community) {
    return <p className="text-center py-10">Cargando comunidad...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-8 flex gap-5">
      <div className="w-full">
        <Card>
          <CardContent>
            <h1 className="mt-4 mb-3 text-2xl font-bold">{community?.name}</h1>
            {community?.banner_url && (
              <img
                src={community?.banner_url}
                alt="banner"
                className="rounded-lg w-full object-cover h-100"
              />
            )}

            <div className="flex items-center flex-wrap gap-4 text-sm text-muted-foreground pt-5">
              {/* Privado */}
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                <span>{community?.is_public ? "Público" : "Privado"} </span>
              </div>

              {/* Miembros */}
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{info?.memberCount} miembros</span>
              </div>

              {/* Gratis o con precio */}
              <div className="flex items-center gap-1">
                <Tag className="w-4 h-4" />
                <span>
                  {community.is_public ? "Free" : ""} PEN {community.price}
                  /mes
                </span>
              </div>

              {/* Creador */}
              <div className="flex items-center gap-2">
                <User className="w-4 h-4"></User>
                <span>Por {community?.profile?.full_name}</span>
              </div>
            </div>
            <div className="mt-6 text-sm leading-relaxed text-foreground/90">
              {community?.description_large}
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        style={{ minWidth: "300px", maxWidth: "300px" }}
        className="bg-muted/40  rounded-lg mt-0 "
      >
        <div className="flex items-center gap-4">
          {community.banner_url && (
            <img
              src={community.banner_url}
              alt="logo"
              className="rounded-t-xs"
            />
          )}
        </div>
        <Card>
          <CardContent>
            <div>
              <p className=" mt-3 text-1xl font-bold">{community.name}</p>
              <p className="text-sm text-muted-foreground mb-3">
                @{community.slug}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              {community.description || "Comunidad privada en Escuelita"}
            </p>
            <div className="border-t"></div>
            <div className="text-sm space-y-1   grid grid-cols-3">
              <div className="text-center border-r py-3">
                <strong>{community.member_count || "6.3k"}</strong>
                <br></br> miembros
              </div>
              <div className="text-center  border-r py-3">
                <strong> {community.online_count || "51"}</strong>
                <br></br> en línea
              </div>
              <div className="text-center  py-3">
                <strong>{community.admin_count || "2"}</strong>
                <br></br> admins
              </div>
            </div>
            <div className=" mb-2 border-b"></div>
            {member ? (
              <></>
            ) : (
              <>
                {user?.id ? (
                  <Button className="w-full" onClick={() => setOpen(true)}>
                    Unirme PEN {community.price}/mes{" "}
                  </Button>
                ) : (
                  <Button className="w-full">
                    Unirme PEN {community.price}/mes{" "}
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <JoinCommunityModal
        open={open}
        onClose={() => setOpen(false)}
        community={community}
        userId={user?.id ?? null}
      />
    </div>
  );
}
