"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { communitySchema, CommunityFormData } from "@/lib/schemas";
import { Community } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

interface CommunityFormProps {
  community?: Community;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CommunityForm({
  community,
  onSuccess,
  onCancel,
}: CommunityFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    defaultValues: {
      name: community?.name || "",
      slug: community?.slug || "",
      description: community?.description || "",
      description_large: community?.description_large || "",
      banner_url: community?.banner_url || "",
      logo_url: community?.logo_url || "",
      is_public: community?.is_public || false,
      price: community?.price || "",
    },
  });

  const onSubmit = async (data: CommunityFormData) => {
    setLoading(true);
    try {
      if (community) {
        const { error } = await supabase
          .from("communities")
          .update(data)
          .eq("id", community.id);

        if (error) throw error;
        toast.success("Comunidad actualizada exitosamente");
      } else {
        const { error } = await supabase.from("communities").insert([data]);

        if (error) throw error;
        toast.success("Comunidad creada exitosamente");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving community:", error);
      toast.error("Error al guardar la comunidad");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {community ? "Editar Comunidad" : "Nueva Comunidad"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Nombre de la comunidad"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                {...form.register("slug")}
                placeholder="nombre-comunidad"
              />
              {form.formState.errors.slug && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.slug.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              {...form.register("description")}
              placeholder="Descripción breve de la comunidad"
              rows={3}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-red-600">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description_large">Descripción Extendida</Label>
            <Textarea
              id="description_large"
              {...form.register("description_large")}
              placeholder="Descripción detallada de la comunidad"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="logo_url">URL del Logo</Label>
              <Input
                id="logo_url"
                {...form.register("logo_url")}
                placeholder="https://ejemplo.com/logo.png"
                type="url"
              />
              {form.formState.errors.logo_url && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.logo_url.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner_url">URL del Banner</Label>
              <Input
                id="banner_url"
                {...form.register("banner_url")}
                placeholder="https://ejemplo.com/banner.png"
                type="url"
              />
              {form.formState.errors.banner_url && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.banner_url.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio</Label>
              <Input
                id="price"
                {...form.register("price")}
                placeholder="$29.99"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_public"
                checked={form.watch("is_public")}
                onCheckedChange={(checked) =>
                  form.setValue("is_public", checked)
                }
              />
              <Label htmlFor="is_public">Comunidad Pública</Label>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {onCancel && (
              <Button type="button\" variant="outline\" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : community ? "Actualizar" : "Crear"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
