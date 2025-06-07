"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Badge } from "@/components/ui/badge";
import { Post } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { FileText, Pin } from "lucide-react";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: Column<Post>[] = [
    { key: "title", label: "Título" },
    {
      key: "profile.full_name",
      label: "Autor",
      render: (value: string) => value || "Usuario anónimo",
    },
    { key: "category", label: "Categoría" },
    {
      key: "pinned",
      label: "Fijado",
      render: (value: boolean) =>
        value ? (
          <Badge variant="default\" className="flex items-center gap-1">
            <Pin className="w-3 h-3" />
            Fijado
          </Badge>
        ) : (
          <Badge variant="secondary">Normal</Badge>
        ),
    },
    {
      key: "created_at",
      label: "Publicado",
      render: (value: string) => new Date(value).toLocaleDateString("es-ES"),
    },
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profile:profiles(full_name, email)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Error al cargar los posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (post: Post) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este post?")) return;

    try {
      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) throw error;
      toast.success("Post eliminado exitosamente");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Error al eliminar el post");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Posts</h1>
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
            <FileText className="h-8 w-8" />
            Posts
          </h1>
          <p className="text-gray-600">
            Gestiona todas las publicaciones de la plataforma
          </p>
        </div>
      </div>

      <DataTable
        data={posts}
        columns={columns}
        onDelete={handleDelete}
        searchPlaceholder="Buscar posts..."
      />
    </div>
  );
}
