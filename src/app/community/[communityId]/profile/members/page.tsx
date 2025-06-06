"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Member = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  roles: {
    id: string;
    name: string;
  };
};

type Role = {
  id: string;
  name: string;
};

export default function MembersPage() {
  const { communityId } = useParams();
  const [members, setMembers] = useState<Member[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: community, error } = await supabase
        .from("communities")
        .select("*")
        .eq("slug", communityId)
        .single();

      console.log("community", community);
      const { data: profile } = await supabase
        .from("profiles")
        .select("role_id, community_id, roles(name)")
        .eq("id", user.id)
        .single();

      if (profile?.roles?.name === "admin") {
        setIsAdmin(true);
      }

      const { data: membersData } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url, roles(id, name)")
        .eq("community_id", community?.id);

      const { data: rolesData } = await supabase
        .from("roles")
        .select("id, name");

      if (membersData && rolesData) {
        setMembers(membersData);
        setRoles(rolesData);
      }

      setLoading(false);
    };

    loadData();
  }, [communityId]);

  const updateRole = async (userId: string, newRoleId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role_id: newRoleId })
      .eq("id", userId);

    if (error) {
      toast.error("Error al actualizar el rol");
    } else {
      toast.success("Rol actualizado");
      setMembers((prev) =>
        prev.map((m) =>
          m.id === userId
            ? { ...m, roles: roles.find((r) => r.id === newRoleId)! }
            : m
        )
      );
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Miembros</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <Card key={m.id}>
            <CardHeader className="flex flex-row items-center gap-3">
              <Avatar>
                <AvatarImage src={m.avatar_url ?? ""} />
                <AvatarFallback>
                  {m?.full_name ? m?.full_name[0] : ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{m.full_name}</CardTitle>
                <p className="text-sm text-muted-foreground">{m.email}</p>
              </div>
            </CardHeader>
            <CardContent>
              {isAdmin ? (
                <Select
                  value={m.roles?.id}
                  onValueChange={(value) => updateRole(m.id, value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona un rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge>{m.roles?.name}</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
