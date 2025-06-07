"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/admin/data-table";
import { Course } from "@/lib/types";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const columns: Column<Course>[] = [
    { key: "title", label: "Título" },
    { key: "description", label: "Descripción" },
    {
      key: "community.name",
      label: "Comunidad",
      render: (value: string) => value || "Sin comunidad",
    },
    {
      key: "created_at",
      label: "Creado",
      render: (value: string) => new Date(value).toLocaleDateString("es-ES"),
    },
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select(
          `
          *,
          community:communities(name, slug)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Error al cargar los cursos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (course: Course) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este curso?")) return;

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", course.id);

      if (error) throw error;
      toast.success("Curso eliminado exitosamente");
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Error al eliminar el curso");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Cursos</h1>
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
            <GraduationCap className="h-8 w-8" />
            Cursos
          </h1>
          <p className="text-gray-600">
            Gestiona todos los cursos de la plataforma
          </p>
        </div>
      </div>

      <DataTable
        data={courses}
        columns={columns}
        onDelete={handleDelete}
        searchPlaceholder="Buscar cursos..."
      />
    </div>
  );
}
