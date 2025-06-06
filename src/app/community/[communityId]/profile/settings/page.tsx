"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function SettingsPage() {
  const { communityId } = useParams();
  const router = useRouter();

  const [community, setCommunity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const fetchCommunity = async () => {
      const { data } = await supabase
        .from("communities")
        .select("*")
        .eq("slug", communityId)
        .single();

      if (data) {
        setCommunity(data);
        setName(data.name);
        setDescription(data.description);
        setIsPublic(data.public);
      }

      setLoading(false);
    };

    if (communityId) fetchCommunity();
  }, [communityId]);

  const handleSave = async () => {
    const { error } = await supabase
      .from("communities")
      .update({
        name,
        description,
        public: isPublic,
      })
      .eq("id", community.id);

    if (error) {
      toast.error("No se pudo actualizar la comunidad");
    } else {
      toast.success("Comunidad actualizada");
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "banner" | "logo"
  ) => {
    const file = e.target.files?.[0];
    if (!file || !community) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${community.id}_${type}.${fileExt}`;
    const bucket = "community-assets";

    type === "banner" ? setUploadingBanner(true) : setUploadingLogo(true);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) {
      toast.error(`Error al subir la imagen de ${type}`);
    } else {
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const columnToUpdate = type === "banner" ? "banner_url" : "logo_url";

      await supabase
        .from("communities")
        .update({ [columnToUpdate]: urlData.publicUrl })
        .eq("id", community.id);

      setCommunity((prev: any) => ({
        ...prev,
        [columnToUpdate]: urlData.publicUrl,
      }));

      toast.success(`Imagen de ${type} actualizada`);
    }

    type === "banner" ? setUploadingBanner(false) : setUploadingLogo(false);
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "¿Seguro que deseas eliminar esta comunidad?"
    );
    if (!confirm) return;

    const { error } = await supabase
      .from("communities")
      .delete()
      .eq("id", community.id);

    if (error) {
      toast.error("Error al eliminar");
    } else {
      toast.success("Comunidad eliminada");
      router.push("/");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Configuración de Comunidad</h1>

      <div className="space-y-2">
        <Label>Nombre</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Descripción</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Logo</Label>
        {community.logo_url && (
          <img
            src={community.logo_url}
            alt="Logo"
            className="w-24 h-24 object-cover rounded-full"
          />
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "logo")}
        />
      </div>

      <div className="space-y-2">
        <Label>Imagen de portada (banner)</Label>
        {community.banner_url && (
          <img
            src={community.banner_url}
            alt="Banner"
            className="w-full h-40 object-cover rounded"
          />
        )}
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, "banner")}
        />
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={isPublic} onCheckedChange={setIsPublic} />
        <Label>Comunidad pública</Label>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleSave}>Guardar cambios</Button>
        <Button variant="destructive" onClick={handleDelete}>
          Eliminar comunidad
        </Button>
      </div>
    </div>
  );
}
