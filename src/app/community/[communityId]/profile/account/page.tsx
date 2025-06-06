// app/community/[communityId]/profile/account/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ProfileWithRole = {
  id: string;
  email: string;
  full_name: string;
  role_id: number | null;
  roles?: {
    name: string;
  };
};

export default function AccountPage() {
  const { communityId } = useParams();
  const [profile, setProfile] = useState<ProfileWithRole | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role_id, roles(name)")
        .eq("id", user.id)
        .single();

      if (error) {
        toast.error("Error al cargar perfil");
        return;
      }

      setProfile(data);
      setName(data.full_name);
    };

    loadProfile();
  }, []);

  const handleUpdate = async () => {
    if (!profile) return;
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", profile.id);

    if (error) {
      toast.error("Error al guardar");
    } else {
      toast.success("Perfil actualizado");
    }

    setLoading(false);
  };

  if (!profile)
    return <p className="text-sm text-muted-foreground">Cargando...</p>;

  return (
    <div className="space-y-6">
      <div>
        <Label>Correo electrónico</Label>
        <Input value={profile.email} disabled />
      </div>

      <div>
        <Label>Nombre completo</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div>
        <Label>Rol en la comunidad</Label>
        <Input value={profile.roles?.name ?? "Miembro"} disabled />
      </div>

      <Button onClick={handleUpdate} disabled={loading}>
        {loading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </div>
  );
}
