"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "@/components/admin/data-table";
import { CommunityForm } from "@/components/admin/community-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Community } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Plus, Building2 } from "lucide-react";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(
    null
  );

  const columns: Column<Community>[] = [
    { key: "name", label: "Nombre" },
    { key: "slug", label: "Slug" },
    {
      key: "is_public",
      label: "Público",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Público" : "Privado"}
        </Badge>
      ),
    },
    { key: "members_count", label: "Miembros" },
    { key: "price", label: "Precio" },
    {
      key: "created_at",
      label: "Creado",
      render: (value: string) => new Date(value).toLocaleDateString("es-ES"),
    },
  ];

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const { data, error } = await supabase
        .from("communities")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (error) {
      console.error("Error fetching communities:", error);
      toast.error("Error al cargar las comunidades");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (community: Community) => {
    setEditingCommunity(community);
    setShowForm(true);
  };

  const handleDelete = async (community: Community) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta comunidad?"))
      return;

    try {
      const { error } = await supabase
        .from("communities")
        .delete()
        .eq("id", community.id);

      if (error) throw error;
      toast.success("Comunidad eliminada exitosamente");
      fetchCommunities();
    } catch (error) {
      console.error("Error deleting community:", error);
      toast.error("Error al eliminar la comunidad");
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCommunity(null);
    fetchCommunities();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCommunity(null);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Comunidades</h1>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            Comunidades
          </h1>
          <p className="text-gray-600">
            Gestiona todas las comunidades de la plataforma
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Comunidad
        </Button>
      </div>

      <DataTable
        data={communities}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Buscar comunidades..."
      />

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCommunity ? "Editar Comunidad" : "Nueva Comunidad"}
            </DialogTitle>
          </DialogHeader>
          <CommunityForm
            community={editingCommunity}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
